"""Lakes LSWT DAG, packed-temperature rendering, and packaging tests."""

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


class LakesDagTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with patch.object(helper, 'get_default_layer_version', return_value='test'):
            cls.bag = DagBag(str(PIPELINE / 'dags/lakes.lswt.py'), include_examples=False)
        cls.dag = cls.bag.dags['lakes.lswt']

    def test_manual_dag_validates(self):
        self.assertEqual(self.bag.import_errors, {})
        self.dag.validate()
        self.assertIsNone(self.dag.schedule_interval)
        self.assertFalse(self.dag.catchup)

    def test_isolated_workspace_and_serial_raster_stages(self):
        cleanup = self.dag.get_task('clean_dir_skippable.clean_workdir_delete')
        self.assertIn('/workdir/lakes.lswt', cleanup.bash_command)
        self.assertNotIn('/workdir/files', cleanup.bash_command)
        self.assertEqual(self.dag.max_active_runs, 1)
        for name in ('reproject_and_to_tiff', 'gdal_dem', 'gdal_translate_image'):
            self.assertEqual(self.dag.get_task(f'gdal_transforms_group.{name}').max_active_tis_per_dag, 1)

    def test_defaults_target_small_test_run(self):
        self.assertEqual(self.dag.params['max_files'], 2)
        self.assertEqual(self.dag.params['output_bucket'], 'esa-cfs-pipeline-output')
        self.assertFalse(self.dag.params['skip_downloads'])

    def test_upload_waits_for_all_artifacts(self):
        self.assertTrue({
            'metadata', 'legend_image', 'gdal_transforms_group.gdal_translate_image'
        }.issubset(self.dag.get_task('upload.clean_upload_dir').upstream_task_ids))

    def test_warp_uses_correct_bounds_and_preserves_packed_values(self):
        command = self.dag.get_task('gdal_transforms_group.reproject_and_to_tiff').partial_kwargs['bash_command']
        for option in ('-t_srs EPSG:4326', '-te -180 -90 180 90', '-ts 4320 2160',
                       '-r near', 'GDAL_CACHEMAX 256', '-wm 128', 'NETCDF:"$FILEPATH_IN":$DATA_VARIABLE'):
            self.assertIn(option, command)
        self.assertNotIn('-unscale', command)
        self.assertNotIn('-te -180 -90 360 180', command)

    def test_metadata_has_physical_display_range_and_actual_dates(self):
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / 'metadata.json'
            with patch.object(task_factories.Path, 'joinpath', return_value=destination):
                self.dag.get_task('metadata').python_callable(
                    ['lakes.lswt/19950601.nc', 'lakes.lswt/19950701.nc'],
                    params={'layer_version': 'lakes-test'}
                )
            metadata = json.loads(destination.read_text())
        self.assertEqual(metadata['id'], 'lakes.lswt')
        self.assertEqual(metadata['version'], 'lakes-test')
        self.assertEqual(metadata['type'], 'image')
        self.assertEqual((metadata['minValue'], metadata['maxValue'], metadata['units']), (-5, 35, '°C'))
        self.assertEqual(metadata['legendValues'], ['35 °C', '-5'])
        self.assertEqual(metadata['basemap'], 'dark')
        self.assertEqual(metadata['zoomLevels'], 4)
        self.assertEqual(metadata['timeFormat'], {'year': 'numeric', 'month': 'long'})
        self.assertEqual(metadata['timestamps'], ['1995-06-01T00:00:00Z', '1995-07-01T00:00:00Z'])


class LakesArtifactTests(unittest.TestCase):
    def test_assets_exist_and_ramp_has_no_legacy_ice_or_fill_codes(self):
        self.assertTrue((PIPELINE / 'plugins/layer-icons/lakes.lswt.png').is_file())
        stops = (PIPELINE / 'plugins/colors/lakes.lswt.txt').read_text().splitlines()
        self.assertEqual(stops[0], '3500 120 10 10')
        self.assertEqual(stops[-2:], ['-500 10 10 60', 'nv 0 0 0 0'])
        self.assertFalse(any(line.startswith(('-5000 ', '-4999 ', '-42767 ')) for line in stops))

    @unittest.skipUnless(shutil.which('gdaldem') and shutil.which('gdal_translate'), 'GDAL CLI required')
    def test_packed_kelvin_renders_celsius_colors_and_transparent_fill(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / 'packed.asc'
            source.write_text(
                'ncols 5\nnrows 1\nxllcorner -180\nyllcorner 0\ncellsize 1\n'
                'NODATA_value -32768\n-32768 0 500 1500 3500\n'
            )
            packed, colored = root / 'packed.tif', root / 'colored.tif'
            subprocess.run([
                'gdal_translate', '-a_scale', '0.01', '-a_offset', '273.15', str(source), str(packed)
            ], check=True, capture_output=True)
            subprocess.run([
                'gdaldem', 'color-relief', str(packed),
                str(PIPELINE / 'plugins/colors/lakes.lswt.txt'), str(colored), '-alpha'
            ], check=True, capture_output=True)
            bands = []
            for band in range(1, 5):
                xyz = subprocess.check_output([
                    'gdal_translate', '-q', '-of', 'XYZ', '-b', str(band), str(colored), '/vsistdout/'
                ], text=True)
                bands.append([int(float(line.split()[2])) for line in xyz.splitlines()])
        self.assertEqual(list(zip(*bands)), [
            (0, 0, 0, 0), (40, 40, 140, 255), (65, 168, 240, 255),
            (148, 200, 148, 255), (120, 10, 10, 255)
        ])

    def test_images_and_lakes_icon_are_packaged(self):
        with tempfile.TemporaryDirectory() as directory:
            workdir = Path(directory)
            upload_dir = workdir / 'upload'
            upload_dir.mkdir()
            (workdir / '19950601.png').write_bytes(b'lake image')
            (workdir / 'metadata.json').write_text(json.dumps({'timestamps': ['1995-06-01T00:00:00Z']}))
            (workdir / 'legend.png').write_bytes(b'legend')
            copyfile = shutil.copyfile

            def copy_with_local_icon(source, destination, *args, **kwargs):
                if str(source).startswith('/opt/airflow/plugins/layer-icons/'):
                    self.assertEqual(Path(source).name, 'lakes.lswt.png')
                    source = PIPELINE / 'plugins/layer-icons/lakes.lswt.png'
                return copyfile(source, destination, *args, **kwargs)

            with patch.object(task_factories.shutil, 'copyfile', side_effect=copy_with_local_icon):
                task_factories.prepare_upload(str(workdir), str(upload_dir), 'image', 'lakes', 'lswt').function()
            with zipfile.ZipFile(upload_dir / 'package.zip') as archive:
                self.assertIsNone(archive.testzip())
                self.assertEqual(archive.read('tiles/0/full.png'), b'lake image')
                self.assertEqual(archive.read('icon.png'),
                                 (PIPELINE / 'plugins/layer-icons/lakes.lswt.png').read_bytes())


if __name__ == '__main__':
    unittest.main()
