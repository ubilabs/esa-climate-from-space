"""Regression checks for the fire workspace, packaging order and upload command."""

from pathlib import Path
import inspect
import sys
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

    def test_isolated_manual_dag(self):
        self.assertEqual(self.bag.import_errors, {})
        self.dag.validate()
        self.assertIsNone(self.dag.schedule_interval)
        self.assertEqual(self.dag.max_active_runs, 1)
        cleanup = self.dag.get_task('clean_dir_skippable.clean_workdir_delete')
        self.assertIn('/workdir/fire.burned_area', cleanup.bash_command)
        self.assertNotIn('/workdir/files', cleanup.bash_command)

    def test_packaging_uses_same_workspace_as_rendering(self):
        task = self.dag.get_task('upload.prepare_upload')
        captured = inspect.getclosurevars(task.python_callable).nonlocals
        self.assertEqual(captured['workdir'], '/workdir/fire.burned_area')
        self.assertEqual(captured['upload_dir'], '/workdir/fire.burned_area/upload')
        upload = self.dag.get_task('upload.gcloud_upload')
        self.assertEqual(upload.env['UPLOAD_DIR'], '/workdir/fire.burned_area/upload')

    def test_upload_waits_for_metadata_legend_and_images(self):
        self.assertTrue({'metadata', 'legend_image', 'gdal_transforms_group.gdal_translate_image'}.issubset(
            self.dag.get_task('upload.clean_upload_dir').upstream_task_ids))

    def test_upload_uses_directory_not_expanded_wildcard(self):
        task = task_factories.gcloud_upload_dir('fire', 'burned_area', '/workdir/fire.burned_area/upload')
        self.assertIn('--delete-unmatched-destination-objects "$UPLOAD_DIR" "$BUCKET"', task.bash_command)
        self.assertNotIn('$UPLOAD_DIR/*', task.bash_command)
        self.assertIn('--key-file "$KEY_FILE"', task.bash_command)
        self.assertEqual(task.env['CLOUDSDK_PYTHON'], '/usr/bin/python3')


if __name__ == '__main__':
    unittest.main()
