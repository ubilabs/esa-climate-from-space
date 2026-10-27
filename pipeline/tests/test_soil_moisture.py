"""Soil-moisture DAG and image packaging tests; no GCS access required."""

import json
from pathlib import Path
import shutil
import sys
import tempfile
import unittest
from unittest.mock import patch
import zipfile

from airflow.models import DagBag


PIPELINE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PIPELINE / 'dags'))

import helper
import task_factories


class SoilMoistureDagTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with patch.object(helper, 'get_default_layer_version', return_value='test'):
            cls.bag = DagBag(str(PIPELINE / 'dags' / 'soil_moisture.sm.py'), include_examples=False)
        cls.dag = cls.bag.dags['soil_moisture.sm']

    def test_dag_validates(self):
        self.assertEqual(self.bag.import_errors, {})
        self.dag.validate()

    def test_workspace_is_isolated_and_runs_do_not_overlap(self):
        cleanup = self.dag.get_task('clean_dir_skippable.clean_workdir_delete')
        self.assertIn('/workdir/soil_moisture.sm', cleanup.bash_command)
        self.assertNotIn('/workdir/files', cleanup.bash_command)
        self.assertEqual(self.dag.max_active_runs, 1)

    def test_upload_waits_for_all_artifacts(self):
        dependencies = self.dag.get_task('upload.clean_upload_dir').upstream_task_ids
        self.assertTrue({
            'metadata', 'legend_image', 'gdal_transforms_group.gdal_translate_image'
        }.issubset(dependencies))

    def test_defaults_target_a_small_test_run(self):
        self.assertEqual(self.dag.params['output_bucket'], 'esa-cfs-pipeline-output')
        self.assertEqual(self.dag.params['max_files'], 2)
        self.assertFalse(self.dag.params['skip_downloads'])

    def test_processing_uses_sm_and_image_output(self):
        self.assertIn('gdal_transforms_group.gdal_translate_image', self.dag.task_ids)
        self.assertNotIn('gdal_transforms_group.gdal_translate_tiles', self.dag.task_ids)
        metadata_task = self.dag.get_task('metadata')
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(task_factories.Path, 'joinpath', return_value=Path(directory) / 'metadata.json'):
                metadata_task.python_callable(
                    ['soil_moisture.sm/19781101.nc', 'soil_moisture.sm/19781201.nc'],
                    params={'layer_version': 'soil-moisture-test'}
                )
            metadata = json.loads((Path(directory) / 'metadata.json').read_text())
        self.assertEqual(metadata['id'], 'soil_moisture.sm')
        self.assertEqual(metadata['type'], 'image')
        self.assertEqual(metadata['timestamps'], ['1978-11-01T00:00:00Z', '1978-12-01T00:00:00Z'])


class SoilMoisturePackagingTests(unittest.TestCase):
    def test_monthly_images_and_default_icon_are_packaged(self):
        with tempfile.TemporaryDirectory() as directory:
            workdir = Path(directory)
            upload_dir = workdir / 'upload'
            upload_dir.mkdir()
            for name in ('19781101', '19781201'):
                (workdir / f'{name}.png').write_bytes(name.encode())
            (workdir / 'metadata.json').write_text(json.dumps({
                'timestamps': ['1978-11-01T00:00:00Z', '1978-12-01T00:00:00Z']
            }))
            (workdir / 'legend.png').write_bytes(b'legend')
            icon = workdir / 'source-icon.png'
            icon.write_bytes(b'icon')
            copyfile = shutil.copyfile

            def copy_with_local_icon(source, destination, *args, **kwargs):
                if str(source).startswith('/opt/airflow/plugins/layer-icons/'):
                    self.assertEqual(Path(source).name, 'soil_moisture.sm.png')
                    source = icon
                return copyfile(source, destination, *args, **kwargs)

            with patch.object(task_factories.shutil, 'copyfile', side_effect=copy_with_local_icon):
                task_factories.prepare_upload(
                    str(workdir), str(upload_dir), 'image', 'soil_moisture', 'sm'
                ).function()

            self.assertEqual((upload_dir / 'tiles/0/full.png').read_bytes(), b'19781101')
            self.assertEqual((upload_dir / 'tiles/1/full.png').read_bytes(), b'19781201')
            with zipfile.ZipFile(upload_dir / 'package.zip') as archive:
                self.assertTrue({
                    'metadata.json', 'legend.png', 'icon.png',
                    'tiles/0/full.png', 'tiles/1/full.png'
                }.issubset(archive.namelist()))


if __name__ == '__main__':
    unittest.main()
