"""MODIS monthly burned-area product selection and pipeline-compatible exports."""

import contextlib
import importlib.util
import io
import json
from pathlib import Path
import sys
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import Mock, patch


DOWNLOADS = Path(__file__).resolve().parents[1] / 'downloads'
sys.path.insert(0, str(DOWNLOADS))
import toolbox_download as toolbox

SPEC = importlib.util.spec_from_file_location('fire_toolbox', DOWNLOADS / 'toolbox-fire.py')
fire = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(fire)

DATASET_ID = 'esacci.FIRE.mon.L4.BA.MODIS.Terra.MODIS_TERRA.v5-1.grid'


class FireToolboxTests(unittest.TestCase):
    def setUp(self):
        self.output = io.StringIO()
        for redirect in (contextlib.redirect_stdout, contextlib.redirect_stderr):
            manager = redirect(self.output)
            manager.__enter__()
            self.addCleanup(manager.__exit__, None, None, None)

    def store(self, version='v5-1', variable='burned_area'):
        store = Mock()
        store.describe_data.return_value.to_dict.return_value = {
            'attrs': {'product_version': version},
            'time_range': ['2001-01-01', '2022-12-31'],
            'data_vars': {variable: {'attrs': {'units': 'm2', 'cell_methods': 'time: sum'}}}
        }
        dataset = SimpleNamespace(time=SimpleNamespace(values=[
            '2001-01-16T12:00:00', '2001-02-15T00:00:00', '2022-12-16T12:00:00'
        ]), close=Mock())
        store.open_data.return_value = dataset
        return store, dataset

    def test_pins_modis_terra_grid_version_and_monthly_cadence(self):
        args = ['--dry-run', '--max-files', '1']
        with patch.object(fire, 'toolbox_main', return_value=0) as main:
            self.assertEqual(fire.main(args), 0)
        main.assert_called_once_with(DATASET_ID, 'burned_area', '5.1', 'fire', 'monthly', '2001-01-01', args)

    def test_dry_run_keeps_actual_midmonth_dates_and_reads_no_pixels(self):
        store, dataset = self.store()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'fire'
            with patch.object(toolbox, 'get_store', return_value=store), patch.object(toolbox, 'export_slice') as export:
                self.assertEqual(fire.main(['--dry-run', '--output-dir', str(root)]), 0)
            self.assertFalse(root.exists())
        store.describe_data.assert_called_once_with(DATASET_ID)
        store.open_data.assert_called_once_with(
            DATASET_ID, variable_names=['burned_area'], time_range=['2001-01-01', '2022-12-31'])
        export.assert_not_called()
        dataset.close.assert_called_once()
        for filename in ('20010116.nc', '20010215.nc', '20221216.nc'):
            self.assertIn(filename, self.output.getvalue())
        self.assertNotIn('20010101.nc', self.output.getvalue())

    def test_default_output_is_version_isolated(self):
        store, _ = self.store()
        with patch.object(toolbox, 'get_store', return_value=store), patch.object(toolbox, 'prepare_output') as prepare:
            self.assertEqual(fire.main(['--dry-run']), 0)
        self.assertEqual(prepare.call_args.args[0], toolbox.DOWNLOAD_ROOT / 'fire/v5.1')

    def test_wrong_version_or_non_area_product_is_rejected(self):
        for options in ({'version': '5.0'}, {'variable': 'fraction_of_burnable_area'}):
            with self.subTest(options=options), tempfile.TemporaryDirectory() as directory:
                store, _ = self.store(**options)
                with patch.object(toolbox, 'get_store', return_value=store):
                    self.assertEqual(fire.main(['--dry-run', '--output-dir', directory]), 1)
                store.open_data.assert_not_called()

    def test_untracked_legacy_files_are_not_overwritten(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / '20010101.nc'
            path.write_bytes(b'legacy')
            with patch.object(toolbox, 'get_store') as store:
                self.assertEqual(fire.main(['--output-dir', directory]), 1)
            store.assert_not_called()
            self.assertEqual(path.read_bytes(), b'legacy')

    @unittest.skipUnless(importlib.util.find_spec('xarray') and importlib.util.find_spec('netCDF4'),
                         'Requires the Toolbox Python environment')
    def test_export_preserves_area_values_units_and_time_and_skips_on_restart(self):
        import numpy as np
        import xarray as xr
        dataset = xr.Dataset(
            {'burned_area': (('time', 'lat', 'lon'), np.array([[[0, 1000000], [400000000, np.nan]]], dtype='float32'))},
            coords={'time': np.array(['2001-01-16T12:00:00'], dtype='datetime64[ns]'),
                    'lat': [0.125, -0.125], 'lon': [10.125, 10.375]}
        )
        dataset.burned_area.attrs.update(units='m2', cell_methods='time: sum')
        store, _ = self.store()
        store.open_data.return_value = dataset
        with tempfile.TemporaryDirectory() as directory, patch.object(toolbox, 'get_store', return_value=store):
            args = ['--max-files', '1', '--output-dir', directory]
            self.assertEqual(fire.main(args), 0)
            path = Path(directory) / '20010116.nc'
            with xr.open_dataset(path) as output:
                self.assertEqual(list(output.data_vars), ['burned_area'])
                self.assertEqual(output.burned_area.attrs['units'], 'm2')
                self.assertEqual(output.burned_area.attrs['cell_methods'], 'time: sum')
                self.assertEqual(output.attrs['source_dataset_id'], DATASET_ID)
                self.assertEqual(output.attrs['output_sampling'], 'monthly')
                np.testing.assert_equal(output.time.values, dataset.time.values)
                np.testing.assert_allclose(output.burned_area.values, dataset.burned_area.values, equal_nan=True)
            with patch.object(toolbox, 'export_slice') as export:
                self.assertEqual(fire.main(args), 0)
            export.assert_not_called()
            self.assertEqual(json.loads((Path(directory) / 'download-manifest.json').read_text())['version'], '5.1')


if __name__ == '__main__':
    unittest.main()
