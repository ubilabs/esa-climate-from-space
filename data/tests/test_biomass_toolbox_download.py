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

SPEC = importlib.util.spec_from_file_location('biomass_toolbox', DOWNLOADS / 'toolbox-biomass.py')
biomass = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(biomass)

DATASET_ID = 'esacci.BIOMASS.yr.L4.AGB.multi-sensor.multi-platform.MERGED.7-0.100m'


class BiomassToolboxTests(unittest.TestCase):
    def setUp(self):
        self.output = io.StringIO()
        stdout = contextlib.redirect_stdout(self.output)
        stderr = contextlib.redirect_stderr(self.output)
        stdout.__enter__()
        stderr.__enter__()
        self.addCleanup(stdout.__exit__, None, None, None)
        self.addCleanup(stderr.__exit__, None, None, None)

    def store(self, version='7.0', variable='agb'):
        metadata = {
            'attrs': {'product_version': version},
            'time_range': ['2005-01-01', '2024-12-31'],
            'data_vars': {variable: {'attrs': {'grid_mapping': 'crs'}}, 'crs': {}}
        }
        dataset = SimpleNamespace(time=SimpleNamespace(values=['2005-01-01', '2006-01-01']), close=Mock())
        store = Mock()
        store.describe_data.return_value.to_dict.return_value = metadata
        store.open_data.return_value = dataset
        return store, dataset

    def test_entrypoint_pins_toolbox_native_product_and_forwards_options(self):
        args = ['--dry-run', '--max-files', '1', '--bbox', '10', '50', '11', '51']
        with patch.object(biomass, 'toolbox_main', return_value=0) as main:
            self.assertEqual(biomass.main(args), 0)
        main.assert_called_once_with(DATASET_ID, 'agb', '7.0', 'biomass', 'annual', '2005-01-01', args, chunked=True)

    def test_dry_run_uses_esa_cci_without_writing_or_exporting(self):
        store, dataset = self.store()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'biomass'
            with patch.object(toolbox, 'get_store', return_value=store) as factory, \
                    patch.object(toolbox, 'export_slice') as export:
                self.assertEqual(biomass.main(['--dry-run', '--max-files', '1', '--output-dir', str(root)]), 0)
            factory.assert_called_once_with()
            store.describe_data.assert_called_once_with(DATASET_ID)
            store.open_data.assert_called_once_with(
                DATASET_ID, variable_names=['agb', 'crs'], time_range=['2005-01-01', '2024-12-31'])
            export.assert_not_called()
            self.assertFalse(root.exists())
        self.assertIn('20050101.nc', self.output.getvalue())
        self.assertNotIn('20060101.nc', self.output.getvalue())
        dataset.close.assert_called_once()

    def test_bbox_and_date_range_are_passed_to_toolbox(self):
        store, _ = self.store()
        with tempfile.TemporaryDirectory() as directory, patch.object(toolbox, 'get_store', return_value=store):
            self.assertEqual(biomass.main([
                '--dry-run', '--start-date', '2005-01-01', '--end-date', '2005-12-31',
                '--bbox', '10', '50', '11', '51', '--output-dir', directory
            ]), 0)
        self.assertEqual(store.open_data.call_args.kwargs['bbox'], [10, 50, 11, 51])
        self.assertEqual(store.open_data.call_args.kwargs['time_range'], ['2005-01-01', '2005-12-31'])

    def test_provider_errors_do_not_fall_back_to_direct_ceda(self):
        with tempfile.TemporaryDirectory() as directory, \
                patch.object(toolbox, 'get_store', side_effect=OSError('Toolbox unavailable')):
            self.assertEqual(biomass.main(['--dry-run', '--output-dir', directory]), 1)
        self.assertIn('Toolbox unavailable', self.output.getvalue())

    def test_wrong_version_or_missing_agb_fails_before_opening(self):
        for options in ({'version': '6.0'}, {'variable': 'agb_change'}):
            with self.subTest(options=options), tempfile.TemporaryDirectory() as directory:
                store, _ = self.store(**options)
                with patch.object(toolbox, 'get_store', return_value=store):
                    self.assertEqual(biomass.main(['--dry-run', '--output-dir', directory]), 1)
                store.open_data.assert_not_called()

    def test_direct_ceda_manifest_is_not_overwritten_or_mixed(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            identity = {
                'dataset_id': DATASET_ID, 'version': '7.0', 'variable': 'agb', 'sampling': 'annual',
                'bbox': None, 'transport': 'ceda-netcdf', 'representation': 'original-netcdf'
            }
            manifest = root / 'download-manifest.json'
            manifest.write_text(json.dumps(identity))
            with patch.object(toolbox, 'get_store') as factory:
                self.assertEqual(biomass.main(['--dry-run', '--output-dir', directory]), 1)
            factory.assert_not_called()
            self.assertEqual(json.loads(manifest.read_text()), identity)

    def test_excessive_chunk_retries_are_rejected_before_network_access(self):
        with patch.object(toolbox, 'get_store') as factory:
            self.assertEqual(biomass.main(['--dry-run', '--chunk-retries', '11']), 1)
        factory.assert_not_called()

    @unittest.skipUnless(importlib.util.find_spec('xarray') and importlib.util.find_spec('netCDF4'),
                         'Requires the Toolbox Python environment')
    def test_small_toolbox_export_is_readable_and_resumes(self):
        import numpy as np
        import xarray as xr
        dataset = xr.Dataset(
            {'agb': (('time', 'lat', 'lon'), np.array([[[100, 200], [0, np.nan]]], dtype='float32')),
             'crs': ((), 0)},
            coords={'time': np.array(['2005-01-01'], dtype='datetime64[ns]'),
                    'lat': [50.0, 51.0], 'lon': [10.0, 11.0]}
        )
        dataset.agb.attrs.update(units='Mg/ha', grid_mapping='crs')
        dataset.attrs['product_version'] = '7.0'
        dataset.set_close(Mock())
        store, _ = self.store()
        store.open_data.return_value = dataset
        with tempfile.TemporaryDirectory() as directory, patch.object(toolbox, 'get_store', return_value=store):
            args = ['--max-files', '1', '--output-dir', directory]
            self.assertEqual(biomass.main(args), 0)
            path = Path(directory) / '20050101.nc'
            with xr.open_dataset(path) as output:
                self.assertEqual(output.sizes['time'], 1)
                self.assertIn('crs', output)
                self.assertEqual(output.attrs['source_dataset_id'], DATASET_ID)
                self.assertEqual(output.attrs['output_sampling'], 'annual')
                self.assertEqual(output.agb.attrs['units'], 'Mg/ha')
                np.testing.assert_allclose(output.agb.values, dataset.agb.values, equal_nan=True)
            with patch.object(toolbox, 'export_slice') as export:
                self.assertEqual(biomass.main(args), 0)
                export.assert_not_called()


if __name__ == '__main__':
    unittest.main()
