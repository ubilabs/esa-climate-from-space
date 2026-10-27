"""Water-vapour DAG, NaN handling, palette, and image packaging tests."""

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


class WaterVapourDagTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with patch.object(helper, 'get_default_layer_version', return_value='test'):
            cls.bag = DagBag(str(PIPELINE / 'dags/water_vapour.tcwv.py'), include_examples=False)
        cls.dag = cls.bag.dags['water_vapour.tcwv']

    def test_manual_dag_validates(self):
        self.assertEqual(self.bag.import_errors, {})
        self.dag.validate()
        self.assertIsNone(self.dag.schedule_interval)
        self.assertFalse(self.dag.catchup)

    def test_isolated_workspace_and_serial_raster_stages(self):
        cleanup = self.dag.get_task('clean_dir_skippable.clean_workdir_delete')
        self.assertIn('/workdir/water_vapour.tcwv', cleanup.bash_command)
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
        self.assertNotIn('gdal_transforms_group.gdal_translate_tiles', self.dag.task_ids)

    def test_warp_assigns_verified_source_crs_and_legacy_output_size(self):
        command = self.dag.get_task('gdal_transforms_group.reproject_and_to_tiff').partial_kwargs['bash_command']
        for option in ('-s_srs EPSG:4326', '-t_srs EPSG:4326', '-te -180 -90 180 90',
                       '-ts 2048 1024', '-r near', 'GDAL_CACHEMAX 256', '-wm 128',
                       'NETCDF:"$FILEPATH_IN":$DATA_VARIABLE'):
            self.assertIn(option, command)
        self.assertNotIn('-unscale', command)

    def test_metadata_matches_source_range_and_midmonth_dates(self):
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / 'metadata.json'
            with patch.object(task_factories.Path, 'joinpath', return_value=destination):
                self.dag.get_task('metadata').python_callable(
                    ['water_vapour.tcwv/20000316.nc', 'water_vapour.tcwv/20000416.nc'],
                    params={'layer_version': 'water-vapour-test'}
                )
            metadata = json.loads(destination.read_text())
        self.assertEqual(metadata['id'], 'water_vapour.tcwv')
        self.assertEqual(metadata['version'], 'water-vapour-test')
        self.assertEqual(metadata['type'], 'image')
        self.assertEqual((metadata['minValue'], metadata['maxValue'], metadata['units']), (0, 70, 'kg/m²'))
        self.assertEqual(metadata['legendValues'], ['70 kg/m²', '0'])
        self.assertEqual(metadata['basemap'], 'land')
        self.assertEqual(metadata['zoomLevels'], 4)
        self.assertEqual(metadata['timeFormat'], {'year': 'numeric', 'month': 'long'})
        self.assertEqual(metadata['timestamps'], ['2000-03-16T00:00:00Z', '2000-04-16T00:00:00Z'])


class WaterVapourArtifactTests(unittest.TestCase):
    def test_assets_and_legacy_palette_are_available(self):
        self.assertTrue((PIPELINE / 'plugins/layer-icons/water_vapour.tcwv.png').is_file())
        self.assertEqual((PIPELINE / 'plugins/colors/water_vapour.tcwv.txt').read_text().splitlines(), [
            '70 52 94 153 255', '35 119 194 174 255', '0 119 194 174 0', 'nv 0 0 0 0'
        ])

    @unittest.skipUnless(shutil.which('gdaldem') and shutil.which('gdal_translate'), 'GDAL CLI required')
    def test_nan_and_zero_are_transparent_and_physical_values_use_legacy_colors(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / 'values.asc'
            source.write_text(
                'ncols 5\nnrows 1\nxllcorner -180\nyllcorner 0\ncellsize 1\n'
                'NODATA_value nan\nnan 0 17.5 35 70\n'
            )
            colored = root / 'colored.tif'
            subprocess.run([
                'gdaldem', 'color-relief', str(source),
                str(PIPELINE / 'plugins/colors/water_vapour.tcwv.txt'), str(colored), '-alpha'
            ], check=True, capture_output=True)
            bands = []
            for band in range(1, 5):
                xyz = subprocess.check_output([
                    'gdal_translate', '-q', '-of', 'XYZ', '-b', str(band), str(colored), '/vsistdout/'
                ], text=True)
                bands.append([int(float(line.split()[2])) for line in xyz.splitlines()])
        rgba = list(zip(*bands))
        self.assertEqual(rgba[:2], [(0, 0, 0, 0), (119, 194, 174, 0)])
        self.assertEqual(rgba[2][:3], (119, 194, 174))
        self.assertIn(rgba[2][3], (127, 128))
        self.assertEqual(rgba[3:], [(119, 194, 174, 255), (52, 94, 153, 255)])

    def test_images_and_water_vapour_icon_are_packaged(self):
        with tempfile.TemporaryDirectory() as directory:
            workdir = Path(directory)
            upload_dir = workdir / 'upload'
            upload_dir.mkdir()
            (workdir / '20000316.png').write_bytes(b'water vapour image')
            (workdir / 'metadata.json').write_text(json.dumps({'timestamps': ['2000-03-16T00:00:00Z']}))
            (workdir / 'legend.png').write_bytes(b'legend')
            copyfile = shutil.copyfile

            def copy_with_local_icon(source, destination, *args, **kwargs):
                if str(source).startswith('/opt/airflow/plugins/layer-icons/'):
                    self.assertEqual(Path(source).name, 'water_vapour.tcwv.png')
                    source = PIPELINE / 'plugins/layer-icons/water_vapour.tcwv.png'
                return copyfile(source, destination, *args, **kwargs)

            with patch.object(task_factories.shutil, 'copyfile', side_effect=copy_with_local_icon):
                task_factories.prepare_upload(str(workdir), str(upload_dir), 'image', 'water_vapour', 'tcwv').function()
            with zipfile.ZipFile(upload_dir / 'package.zip') as archive:
                self.assertIsNone(archive.testzip())
                self.assertEqual(archive.read('tiles/0/full.png'), b'water vapour image')
                self.assertEqual(archive.read('icon.png'),
                                 (PIPELINE / 'plugins/layer-icons/water_vapour.tcwv.png').read_bytes())


if __name__ == '__main__':
    unittest.main()
