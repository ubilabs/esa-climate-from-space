"""Run inside the Airflow image: python -m unittest discover -s /opt/airflow/tests -v."""

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


class PermafrostDagTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with patch.object(helper, 'get_default_layer_version', return_value='test'):
            cls.bag = DagBag(str(PIPELINE / 'dags' / 'permafrost_pfr.py'), include_examples=False)
        cls.dag = cls.bag.dags['permafrost.PFR']

    def test_dag_validates(self):
        self.assertEqual(self.bag.import_errors, {})
        self.dag.validate()

    def test_workspace_is_isolated(self):
        cleanup = self.dag.get_task('clean_dir_skippable.clean_workdir_delete')
        self.assertIn('/workdir/permafrost.PFR', cleanup.bash_command)
        self.assertNotIn('/workdir/files', cleanup.bash_command)

    def test_upload_waits_for_all_artifacts(self):
        dependencies = self.dag.get_task('upload.clean_upload_dir').upstream_task_ids
        self.assertTrue({
            'metadata', 'legend_image', 'gdal_transforms_group.gdal_translate_tiles'
        }.issubset(dependencies))

    def test_large_rasters_and_runs_are_serialized(self):
        self.assertEqual(self.dag.max_active_runs, 1)
        for name in ('reproject_and_to_tiff', 'gdal_dem', 'gdal_translate_tiles'):
            self.assertEqual(self.dag.get_task(f'gdal_transforms_group.{name}').max_active_tis_per_dag, 1)

    def test_defaults_do_not_publish_live(self):
        self.assertEqual(self.dag.params['output_bucket'], 'esa-cfs-pipeline-output')
        self.assertEqual(self.dag.params['max_files'], 2)


class UploadPackagingTests(unittest.TestCase):
    def test_upload_uses_system_python(self):
        task = task_factories.gcloud_upload_dir('permafrost', 'PFR', '/workdir/permafrost.PFR/upload')
        self.assertEqual(task.env['CLOUDSDK_PYTHON'], '/usr/bin/python3')

    def test_explicit_and_default_icons(self):
        for icon_filename in ('permafrost.pfr.png', None):
            with self.subTest(icon_filename=icon_filename), tempfile.TemporaryDirectory() as directory:
                workdir = Path(directory)
                upload_dir = workdir / 'upload'
                upload_dir.mkdir()
                tiles = workdir / '20030702' / '0' / '0'
                tiles.mkdir(parents=True)
                (tiles / '0.png').write_bytes(b'tile')
                (tiles / '0.kml').write_text('excluded')
                (workdir / 'metadata.json').write_text(json.dumps({
                    'timestamps': ['2003-07-02T00:00:00Z']
                }))
                (workdir / 'legend.png').write_bytes(b'legend')
                icon = workdir / 'source-icon.png'
                icon.write_bytes(b'icon')
                copyfile = shutil.copyfile
                expected_icon = icon_filename or 'permafrost.PFR.png'

                def copy_with_local_icon(source, destination, *args, **kwargs):
                    if str(source).startswith('/opt/airflow/plugins/layer-icons/'):
                        self.assertEqual(Path(source).name, expected_icon)
                        source = icon
                    return copyfile(source, destination, *args, **kwargs)

                with patch.object(task_factories.shutil, 'copyfile', side_effect=copy_with_local_icon):
                    task_factories.prepare_upload(
                        str(workdir), str(upload_dir), 'tiles', 'permafrost', 'PFR',
                        icon_filename=icon_filename
                    ).function()

                self.assertEqual((upload_dir / 'icon.png').read_bytes(), b'icon')
                with zipfile.ZipFile(upload_dir / 'package.zip') as archive:
                    self.assertTrue({
                        'metadata.json', 'legend.png', 'icon.png', 'tiles/0/0/0/0.png'
                    }.issubset(archive.namelist()))
                    self.assertFalse(any(name.endswith('.kml') for name in archive.namelist()))


if __name__ == '__main__':
    unittest.main()
