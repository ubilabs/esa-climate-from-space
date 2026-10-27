"""Fire DAG safety and compatibility with Toolbox monthly area exports."""

import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

from airflow.models import DagBag


PIPELINE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PIPELINE / 'dags'))
import helper
import task_factories


class FireDagTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with patch.object(helper, 'get_default_layer_version', return_value='test'):
            cls.bag = DagBag(str(PIPELINE / 'dags/fire.burned_area.py'), include_examples=False)
        cls.dag = cls.bag.dags['fire.burned_area']

    def test_manual_dag_validates_with_isolated_workspace(self):
        self.assertEqual(self.bag.import_errors, {})
        self.dag.validate()
        self.assertIsNone(self.dag.schedule_interval)
        self.assertFalse(self.dag.catchup)
        self.assertEqual(self.dag.max_active_runs, 1)
        command = self.dag.get_task('clean_dir_skippable.clean_workdir_delete').bash_command
        self.assertIn('/workdir/fire.burned_area', command)
        self.assertNotIn('/workdir/files', command)

    def test_safe_test_defaults(self):
        self.assertEqual(self.dag.params['max_files'], 2)
        self.assertEqual(self.dag.params['output_bucket'], 'esa-cfs-pipeline-output')
        self.assertFalse(self.dag.params['skip_downloads'])

    def test_packaging_waits_for_images_legend_and_metadata(self):
        self.assertTrue({'metadata', 'legend_image', 'gdal_transforms_group.gdal_translate_image'}.issubset(
            self.dag.get_task('upload.clean_upload_dir').upstream_task_ids))

    def test_warp_keeps_legacy_grid_and_variable(self):
        command = self.dag.get_task('gdal_transforms_group.reproject_and_to_tiff').partial_kwargs['bash_command']
        self.assertIn('-ts 1440 720', command)
        self.assertIn('-te -180 -90 180 90', command)
        self.assertIn('-r near', command)
        self.assertIn('NETCDF:"$FILEPATH_IN":$DATA_VARIABLE', command)

    def test_metadata_keeps_toolbox_dates_area_units_and_legend(self):
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / 'metadata.json'
            with patch.object(task_factories.Path, 'joinpath', return_value=destination):
                self.dag.get_task('metadata').python_callable(
                    ['fire.burned_area/20010116.nc', 'fire.burned_area/20221216.nc'],
                    params={'layer_version': 'test'})
            metadata = json.loads(destination.read_text())
        self.assertEqual(metadata['timestamps'], ['2001-01-16T00:00:00Z', '2022-12-16T00:00:00Z'])
        self.assertEqual(metadata['id'], 'fire.burned_area')
        self.assertEqual(metadata['units'], 'm2')
        self.assertEqual(metadata['maxValue'], 400000000)
        self.assertEqual(metadata['basemap'], 'dark')
        self.assertEqual(metadata['legendValues'], ['300 km²', '200', '100', '0'])


if __name__ == '__main__':
    unittest.main()
