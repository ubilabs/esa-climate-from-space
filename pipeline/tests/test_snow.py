"""Snow SWE DAG, legacy rendering compatibility, and image packaging tests."""

import json
from pathlib import Path
import shutil
import subprocess
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


class SnowDagTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with patch.object(helper, 'get_default_layer_version', return_value='test'):
            cls.bag = DagBag(str(PIPELINE / 'dags' / 'snow.swe.py'), include_examples=False)
        cls.dag = cls.bag.dags['snow.swe']

    def test_dag_validates_and_is_manual(self):
        self.assertEqual(self.bag.import_errors, {})
        self.dag.validate()
        self.assertIsNone(self.dag.schedule_interval)
        self.assertFalse(self.dag.catchup)

    def test_isolated_workspace_and_one_active_run(self):
        cleanup = self.dag.get_task('clean_dir_skippable.clean_workdir_delete')
        self.assertIn('/workdir/snow.swe', cleanup.bash_command)
        self.assertNotIn('/workdir/files', cleanup.bash_command)
        self.assertEqual(self.dag.max_active_runs, 1)

    def test_upload_waits_for_images_metadata_and_legend(self):
        self.assertTrue({
            'metadata', 'legend_image', 'gdal_transforms_group.gdal_translate_image'
        }.issubset(self.dag.get_task('upload.clean_upload_dir').upstream_task_ids))
        self.assertNotIn('gdal_transforms_group.gdal_translate_tiles', self.dag.task_ids)

    def test_defaults_target_small_test_run(self):
        self.assertEqual(self.dag.params['max_files'], 2)
        self.assertEqual(self.dag.params['output_bucket'], 'esa-cfs-pipeline-output')
        self.assertFalse(self.dag.params['skip_downloads'])

    def test_warp_matches_legacy_global_image_settings(self):
        command = self.dag.get_task('gdal_transforms_group.reproject_and_to_tiff').partial_kwargs['bash_command']
        self.assertIn('-t_srs EPSG:4326', command)
        self.assertIn('-te -180 -90 180 90', command)
        self.assertIn('-ts 1440 720', command)
        self.assertIn('-r near', command)
        self.assertIn('NETCDF:"$FILEPATH_IN":$DATA_VARIABLE', command)

    def test_metadata_keeps_actual_snapshot_dates_and_seasonal_gaps(self):
        task = self.dag.get_task('metadata')
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / 'metadata.json'
            with patch.object(task_factories.Path, 'joinpath', return_value=destination):
                task.python_callable(
                    ['snow.swe/19790102.nc', 'snow.swe/19790502.nc', 'snow.swe/19791001.nc'],
                    params={'layer_version': 'snow-test'}
                )
            metadata = json.loads(destination.read_text())
        self.assertEqual(metadata['id'], 'snow.swe')
        self.assertEqual(metadata['version'], 'snow-test')
        self.assertEqual(metadata['type'], 'image')
        self.assertEqual(metadata['minValue'], 0)
        self.assertEqual(metadata['maxValue'], 250)
        self.assertEqual(metadata['zoomLevels'], 4)
        self.assertEqual(metadata['units'], 'mm')
        self.assertEqual(metadata['basemap'], 'blue')
        self.assertEqual(metadata['timeFormat'], {'year': 'numeric', 'month': 'long'})
        self.assertEqual(metadata['timestamps'], [
            '1979-01-02T00:00:00Z', '1979-05-02T00:00:00Z', '1979-10-01T00:00:00Z'
        ])


class SnowArtifactTests(unittest.TestCase):
    def test_icon_and_legacy_ramp_are_available(self):
        self.assertTrue((PIPELINE / 'plugins/layer-icons/snow.swe.png').is_file())
        stops = (PIPELINE / 'plugins/colors/snow.swe.txt').read_text().splitlines()
        self.assertEqual(stops, ['150 255 255 255 255', '0 255 255 255 0', 'nv 0 0 0 0'])

    @unittest.skipUnless(shutil.which('gdaldem') and shutil.which('gdal_translate'), 'GDAL CLI required')
    def test_negative_flags_nodata_and_zero_are_transparent(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            raster = root / 'flags.asc'
            raster.write_text(
                'ncols 9\nnrows 1\nxllcorner -180\nyllcorner 0\ncellsize 1\n'
                'NODATA_value -100000\n-100000 -30 -20 -10 -1 0 75 150 300\n'
            )
            output = root / 'colored.tif'
            subprocess.run([
                'gdaldem', 'color-relief', str(raster),
                str(PIPELINE / 'plugins/colors/snow.swe.txt'), str(output), '-alpha'
            ], check=True, capture_output=True)
            xyz = subprocess.check_output([
                'gdal_translate', '-q', '-of', 'XYZ', '-b', '4', str(output), '/vsistdout/'
            ], text=True)
            alpha = [int(float(line.split()[2])) for line in xyz.splitlines()]
        self.assertEqual(alpha[:6], [0] * 6)
        self.assertIn(alpha[6], (127, 128))
        self.assertEqual(alpha[7:], [255, 255])

    def test_image_packaging_uses_snow_icon_and_timestamp_order(self):
        with tempfile.TemporaryDirectory() as directory:
            workdir = Path(directory)
            upload_dir = workdir / 'upload'
            upload_dir.mkdir()
            for name in ('19790102', '19790201'):
                (workdir / f'{name}.png').write_bytes(name.encode())
            (workdir / 'metadata.json').write_text(json.dumps({
                'timestamps': ['1979-01-02T00:00:00Z', '1979-02-01T00:00:00Z']
            }))
            (workdir / 'legend.png').write_bytes(b'legend')
            copyfile = shutil.copyfile

            def copy_with_local_icon(source, destination, *args, **kwargs):
                if str(source).startswith('/opt/airflow/plugins/layer-icons/'):
                    self.assertEqual(Path(source).name, 'snow.swe.png')
                    source = PIPELINE / 'plugins/layer-icons/snow.swe.png'
                return copyfile(source, destination, *args, **kwargs)

            with patch.object(task_factories.shutil, 'copyfile', side_effect=copy_with_local_icon):
                task_factories.prepare_upload(
                    str(workdir), str(upload_dir), 'image', 'snow', 'swe'
                ).function()

            with zipfile.ZipFile(upload_dir / 'package.zip') as archive:
                self.assertIsNone(archive.testzip())
                self.assertEqual(archive.read('tiles/0/full.png'), b'19790102')
                self.assertEqual(archive.read('tiles/1/full.png'), b'19790201')
                self.assertEqual(archive.read('icon.png'),
                                 (PIPELINE / 'plugins/layer-icons/snow.swe.png').read_bytes())
                self.assertEqual(archive.read('metadata.json'), (upload_dir / 'metadata.json').read_bytes())


if __name__ == '__main__':
    unittest.main()
