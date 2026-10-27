import contextlib
from datetime import date, datetime
import importlib.util
import io
import json
from pathlib import Path
import subprocess
import sys
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import MagicMock, Mock, patch


DOWNLOADS = Path(__file__).resolve().parents[1] / 'downloads'
sys.path.insert(0, str(DOWNLOADS))
import download_utils as utils
import toolbox_download as toolbox

SPEC = importlib.util.spec_from_file_location('snow_download', DOWNLOADS / 'odp-ftp-snow.py')
snow = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(snow)
PERMAFROST = 'esacci.PERMAFROST.yr.L4.PFR.multi-sensor.multi-platform.MODISLST_CRYOGRID.05-0.NH'
WATER_VAPOUR = 'esacci.WATERVAPOUR.mon.L3S.TCWV.multi-sensor.multi-platform.TCWV_land_005deg.4-2.r1'
NETCDF = b'CDF\x01' + b'example complete payload'


class DownloadUtilityTests(unittest.TestCase):
    def test_timestamp_precision_does_not_assume_nanoseconds(self):
        for value in ['2003-07-02', '2003-07-02T00:00:00.000000', '2003-07-02T00:00:00.000000000']:
            self.assertEqual(utils.timestamp(value), datetime(2003, 7, 2))

    def test_atomic_failure_retains_existing_file_and_removes_partial(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            output = root / 'file.nc'
            output.write_bytes(b'old complete data')
            def fail(path):
                path.write_bytes(b'partial')
                raise OSError('transfer failed')
            with self.assertRaises(OSError):
                utils.atomic_write(output, fail, overwrite=True)
            self.assertEqual(output.read_bytes(), b'old complete data')
            self.assertEqual(list(root.iterdir()), [output])

    def test_atomic_write_does_not_clobber_without_overwrite(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'file.nc'
            output.write_bytes(b'original')
            with self.assertRaises(FileExistsError):
                utils.atomic_write(output, lambda path: path.write_bytes(b'new'))
            self.assertEqual(output.read_bytes(), b'original')

    def test_manifest_prevents_mixed_versions_and_subsets(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'downloads'
            identity = {'dataset_id': PERMAFROST, 'bbox': None}
            utils.prepare_output(root, identity)
            utils.prepare_output(root, identity)
            with self.assertRaises(ValueError):
                utils.prepare_output(root, {'dataset_id': PERMAFROST, 'bbox': [0, 0, 1, 1]})
            self.assertEqual(json.loads((root / 'download-manifest.json').read_text()), identity)

    def test_untracked_legacy_files_are_not_adopted(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / '20000101.nc').write_bytes(NETCDF)
            with self.assertRaises(ValueError):
                utils.prepare_output(root, {'dataset_id': PERMAFROST})

    def test_dry_run_does_not_create_output_directory(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'new'
            utils.prepare_output(root, {'dataset_id': PERMAFROST}, dry_run=True)
            self.assertFalse(root.exists())

    def test_netcdf_validation_rejects_partial_and_non_netcdf(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'file.nc'
            path.write_bytes(NETCDF)
            self.assertTrue(utils.is_netcdf(path, len(NETCDF)))
            self.assertFalse(utils.is_netcdf(path, len(NETCDF) + 1))
            path.write_bytes(b'<html>Error</html>')
            self.assertFalse(utils.is_netcdf(path))


class ToolboxDownloadTests(unittest.TestCase):
    def test_zarr_opener_uses_no_primary_store_parameters(self):
        store = Mock()
        full = MagicMock()
        selected = Mock()
        full.__getitem__.return_value = selected
        store.open_data.return_value = full
        self.assertIs(toolbox.open_zarr_dataset(store, 'lakes.zarr', ['temperature', 'crs'], None), selected)
        store.open_data.assert_called_once_with('lakes.zarr')
        full.__getitem__.assert_called_once_with(['temperature', 'crs'])
        selected.set_close.assert_called_once_with(full.close)

    def test_zarr_opener_subsets_lazily_and_closes_on_failure(self):
        store = Mock()
        full = MagicMock()
        store.open_data.return_value = full
        with patch.object(toolbox, 'spatial_subset', side_effect=ValueError('empty')):
            with self.assertRaises(ValueError):
                toolbox.open_zarr_dataset(store, 'lakes.zarr', ['temperature'], [10, 50, 11, 51])
        full.close.assert_called_once()

    def test_zarr_factory_does_not_receive_unsupported_retry_option(self):
        import types
        module = types.ModuleType('xcube.core.store')
        module.new_data_store = Mock()
        with patch.dict('sys.modules', {'xcube.core.store': module}):
            toolbox.get_store('esa-cci-zarr')
        module.new_data_store.assert_called_once_with('esa-cci-zarr')

    def test_lakes_dry_run_uses_zarr_and_does_not_write(self):
        variable = 'lake_surface_water_temperature'
        data_id = 'ESACCI-LAKES-L3S-LK_PRODUCTS-MERGED-fv3.0.0.zarr'
        store, dataset = self.store(version='v3.0.0', variable=variable)
        dataset.time.values = ['1995-06-01', '2023-12-01']
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'output'
            with patch.object(toolbox, 'get_store', return_value=store) as factory:
                with patch.object(toolbox, 'open_zarr_dataset', return_value=dataset) as opener:
                    with contextlib.redirect_stdout(io.StringIO()):
                        self.assertEqual(toolbox.main(data_id, variable, '3.0.0', 'lakes_lswt', 'monthly', '1995-06-01',
                                                     ['--dry-run', '--max-files', '1', '--output-dir', str(root)],
                                                     store_id='esa-cci-zarr', output_variable='lswt'), 0)
            factory.assert_called_once_with('esa-cci-zarr')
            opener.assert_called_once_with(store, data_id, [variable, 'spatial_ref'], None)
            self.assertFalse(root.exists())

    def test_known_bbox_bug_retries_lazily_without_provider_bbox(self):
        store = Mock()
        full = Mock()
        subset = Mock()
        store.open_data.side_effect = [AttributeError("'list' object has no attribute 'shape'"), full]
        params = {'bbox': [10, 50, 11, 51], 'variable_names': ['agb']}
        with patch.object(toolbox, 'spatial_subset', return_value=subset) as clip:
            with contextlib.redirect_stderr(io.StringIO()):
                self.assertIs(toolbox.open_dataset(store, 'id', params), subset)
        self.assertEqual(store.open_data.call_args.kwargs, {'variable_names': ['agb']})
        clip.assert_called_once_with(full, params['bbox'])
        subset.set_close.assert_called_once_with(full.close)

    def test_unrelated_provider_error_is_not_hidden(self):
        store = Mock()
        store.open_data.side_effect = AttributeError('another bug')
        with self.assertRaises(AttributeError):
            toolbox.open_dataset(store, 'id', {'bbox': [10, 50, 11, 51]})
        store.open_data.assert_called_once()

    def test_failed_bbox_workaround_closes_the_full_dataset(self):
        store = Mock()
        full = Mock()
        store.open_data.side_effect = [AttributeError("'list' object has no attribute 'shape'"), full]
        with patch.object(toolbox, 'spatial_subset', side_effect=ValueError('empty bbox')):
            with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(ValueError):
                toolbox.open_dataset(store, 'id', {'bbox': [10, 50, 11, 51]})
        full.close.assert_called_once()

    def test_structured_toolbox_attributes_are_netcdf_safe(self):
        history = [{'program': 'xcube', 'parameters': {'normalize': True}}]
        attrs = toolbox.netcdf_attributes({'history': history, 'options': {'grid': 'native'},
                                          'enabled': True, 'missing': None, 'units': 'percent',
                                          'valid_range': [0, 100], 'labels': ['a', 'b']})
        self.assertEqual(json.loads(attrs['history']), history)
        self.assertEqual(json.loads(attrs['options']), {'grid': 'native'})
        self.assertEqual(attrs['enabled'], 1)
        self.assertNotIn('missing', attrs)
        self.assertEqual(attrs['valid_range'], [0, 100])
        self.assertEqual(attrs['units'], 'percent')
        self.assertEqual(attrs['labels'], ['a', 'b'])

    def test_annual_selection_is_sorted_and_bounded(self):
        selected = toolbox.select_timestamps(['2005-07-02', '2003-07-02', '2004-07-02'],
                                             date(2003, 1, 1), date(2004, 12, 31), 'annual')
        self.assertEqual([index for index, _ in selected], [1, 2])

    def test_monthly_selection_is_first_coordinate_not_nearest_or_mean(self):
        selected = toolbox.select_timestamps(['2000-01-15', '2000-01-02', '2000-02-03'],
                                             date(2000, 1, 1), None, 'monthly')
        self.assertEqual([instant.day for _, instant in selected], [2, 3])

    def test_duplicate_timestamps_fail(self):
        with self.assertRaises(ValueError):
            toolbox.select_timestamps(['2003-01-01'] * 2, date(2003, 1, 1), None, 'annual')

    def store(self, version='05-0', variable='PFR'):
        dataset = SimpleNamespace(time=SimpleNamespace(values=['2003-07-02', '2004-07-02']), close=Mock())
        metadata = {'attrs': {'product_version': version}, 'time_range': ['2003-01-01', '2023-12-31'],
                    'data_vars': {variable: {'attrs': {'grid_mapping': 'spatial_ref'}}, 'spatial_ref': {}}}
        store = Mock()
        store.describe_data.return_value.to_dict.return_value = metadata
        store.open_data.return_value = dataset
        return store, dataset

    def call(self, args):
        return toolbox.main(PERMAFROST, 'PFR', '5.0', 'permafrost', 'annual', '2003-01-01', args)

    def test_dry_run_plans_without_writing_or_exporting(self):
        store, dataset = self.store()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'output'
            with patch.object(toolbox, 'get_store', return_value=store), patch.object(toolbox, 'export_slice') as export:
                with contextlib.redirect_stdout(io.StringIO()) as output:
                    self.assertEqual(self.call(['--dry-run', '--max-files', '1', '--output-dir', str(root)]), 0)
            self.assertIn('20030702.nc', output.getvalue())
            self.assertNotIn('20040702.nc', output.getvalue())
            self.assertFalse(root.exists())
            export.assert_not_called()
            dataset.close.assert_called_once()
            self.assertEqual(store.open_data.call_args.kwargs['variable_names'], ['PFR', 'spatial_ref'])

    def test_exports_and_resumes_only_valid_matching_files(self):
        store, _ = self.store()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'output'
            args = ['--max-files', '1', '--output-dir', str(root)]
            def export(dataset, index, variable, metadata, dataset_id, cadence, path):
                path.write_bytes(NETCDF)
            with patch.object(toolbox, 'get_store', return_value=store), patch.object(toolbox, 'export_slice', side_effect=export) as write:
                with contextlib.redirect_stdout(io.StringIO()):
                    self.assertEqual(self.call(args), 0)
                self.assertTrue((root / '20030702.nc').exists())
                with patch.object(toolbox, 'validate_existing', return_value=True):
                    with contextlib.redirect_stdout(io.StringIO()):
                        self.assertEqual(self.call(args), 0)
                self.assertEqual(write.call_count, 1)
                with patch.object(toolbox, 'validate_existing', return_value=False):
                    with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
                        self.assertEqual(self.call(args), 1)
                self.assertEqual(write.call_count, 1)

    def test_wrong_provider_version_fails_before_opening(self):
        store, _ = self.store(version='4-0')
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(toolbox, 'get_store', return_value=store):
                with contextlib.redirect_stderr(io.StringIO()):
                    self.assertEqual(self.call(['--output-dir', directory]), 1)
        store.open_data.assert_not_called()

    def test_invalid_range_and_bbox_fail_before_network_access(self):
        for args in [['--start-date', '2002-01-01'], ['--end-date', '2002-12-31'],
                     ['--bbox', '1', '0', '0', '1'], ['--bbox', 'nan', '0', '1', '1']]:
            with self.subTest(args=args), patch.object(toolbox, 'get_store') as store:
                with contextlib.redirect_stderr(io.StringIO()):
                    self.assertEqual(self.call(args), 1)
                store.assert_not_called()

    @unittest.skipUnless(importlib.util.find_spec('xarray') and importlib.util.find_spec('netCDF4'), 'Requires the Toolbox Python environment')
    def test_real_netcdf_export_keeps_time_crs_variable_and_provenance(self):
        import numpy as np
        import xarray as xr
        dataset = xr.Dataset({'PFR': (('time', 'lat', 'lon'), np.ones((2, 2, 2), dtype='float32')),
                              'spatial_ref': ((), 0)},
                             coords={'time': np.array(['2003-07-02', '2004-07-02'], dtype='datetime64[ns]'),
                                     'lat': [50.0, 51.0], 'lon': [0.0, 1.0]})
        history = [{'program': 'xcube', 'parameters': {'normalize': True}}]
        dataset.attrs.update(history=history, normalized=True, empty=None)
        dataset['PFR'].attrs['processing'] = {'method': 'test'}
        dataset['lat'].attrs['enabled'] = True
        metadata = {'data_vars': {'PFR': {'attrs': {'grid_mapping': 'spatial_ref'}}}}
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'out.nc'
            toolbox.export_slice(dataset, 0, 'PFR', metadata, PERMAFROST, 'annual', path)
            with xr.open_dataset(path) as exported:
                self.assertEqual(exported.sizes['time'], 1)
                self.assertIn('spatial_ref', exported)
                self.assertEqual(exported.attrs['source_dataset_id'], PERMAFROST)
                self.assertEqual(json.loads(exported.attrs['history']), history)
                self.assertEqual(json.loads(exported['PFR'].attrs['processing']), {'method': 'test'})
                self.assertEqual(exported.attrs['normalized'], 1)
                self.assertNotIn('empty', exported.attrs)
            self.assertEqual(dataset.attrs['history'], history)
            self.assertEqual(dataset['PFR'].attrs['processing'], {'method': 'test'})
            self.assertTrue(toolbox.validate_existing(path, 'PFR', PERMAFROST, datetime(2003, 7, 2)))

    @unittest.skipUnless(importlib.util.find_spec('xarray') and importlib.util.find_spec('netCDF4'), 'Requires the Toolbox Python environment')
    def test_netcdf_export_handles_biomass_unicode_crs_encoding(self):
        import numpy as np
        import xarray as xr
        dataset = xr.Dataset({'agb': (('time', 'lat', 'lon'), np.ones((1, 1, 1), dtype='float32')),
                              'crs': ((), '')},
                             coords={'time': np.array(['2005-07-02'], dtype='datetime64[ns]'),
                                     'lat': [50.0], 'lon': [10.0]})
        dataset['crs'].encoding['dtype'] = np.dtype('U')
        dataset['crs'].attrs['grid_mapping_name'] = 'latitude_longitude'
        metadata = {'data_vars': {'agb': {'attrs': {'grid_mapping': 'crs'}}}}
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'out.nc'
            toolbox.export_slice(dataset, 0, 'agb', metadata, 'biomass-v7', 'annual', path)
            with xr.open_dataset(path) as exported:
                self.assertIn('crs', exported)
                self.assertEqual(exported['crs'].attrs['grid_mapping_name'], 'latitude_longitude')
                self.assertEqual(exported.attrs['source_dataset_id'], 'biomass-v7')
        self.assertEqual(dataset['crs'].encoding['dtype'], np.dtype('U'))

    @unittest.skipUnless(importlib.util.find_spec('xarray') and importlib.util.find_spec('netCDF4'), 'Requires the Toolbox Python environment')
    def test_lakes_alias_export_keeps_kelvin_and_source_provenance(self):
        import numpy as np
        import xarray as xr
        variable = 'lake_surface_water_temperature'
        dataset = xr.Dataset({variable: (('time', 'lat', 'lon'), np.array([[[281.15]]], dtype='float64')),
                              'crs': ((), 0)},
                             coords={'time': np.array(['1995-06-01'], dtype='datetime64[ns]'),
                                     'lat': [44.5], 'lon': [-87.5]})
        dataset[variable].attrs.update(units='Kelvin', grid_mapping='crs')
        dataset[variable].encoding.update(dtype='int16', scale_factor=0.01, add_offset=273.15, _FillValue=-32768)
        metadata = {'data_vars': {variable: {'attrs': {'grid_mapping': 'crs'}}}}
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'lswt.nc'
            toolbox.export_slice(dataset, 0, variable, metadata, 'lakes.zarr', 'monthly', path, output_variable='lswt')
            with xr.open_dataset(path) as exported:
                self.assertIn('lswt', exported)
                self.assertNotIn(variable, exported)
                self.assertIn('crs', exported)
                self.assertEqual(exported.lswt.attrs['units'], 'Kelvin')
                self.assertAlmostEqual(float(exported.lswt.values[0, 0, 0]), 281.15, places=3)
                self.assertEqual(exported.attrs['source_variable'], variable)
            self.assertTrue(toolbox.validate_existing(path, 'lswt', 'lakes.zarr', datetime(1995, 6, 1)))


class SnowDownloadTests(unittest.TestCase):
    def archive(self):
        root = snow.BASE_PATH
        first = '19790102-ESACCI-L3C_SNOW-SWE-SMMR_NIMBUS7-fv4.0.nc'
        later = first.replace('19790102', '19790104')
        feb = first.replace('19790102', '19790202')
        ftp = Mock()
        entries = {root: [root + '/1980', 'README.txt', root + '/1979'],
                   root + '/1979': ['02', '01'], root + '/1979/01': [later, 'README', first],
                   root + '/1979/02': [feb]}
        ftp.nlst.side_effect = lambda path: entries[path]
        ftp.size.return_value = len(NETCDF)
        ftp.retrbinary.side_effect = lambda command, callback: callback(NETCDF)
        return ftp

    def test_sorted_earliest_actual_file_per_month(self):
        ftp = self.archive()
        files = list(snow.monthly_files(ftp, date(1979, 1, 1), date(1979, 12, 31)))
        self.assertEqual([stamp for stamp, _ in files], [date(1979, 1, 2), date(1979, 2, 2)])
        self.assertIn('/v4.0/1979/01/', files[0][1])

    def test_date_subset_does_not_download_an_out_of_range_first_day(self):
        files = list(snow.monthly_files(self.archive(), date(1979, 1, 3), date(1979, 1, 31)))
        self.assertEqual([stamp for stamp, _ in files], [date(1979, 1, 4)])

    def test_atomic_download_resume_and_incomplete_transfer(self):
        ftp = self.archive()
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / '19790102.nc'
            self.assertTrue(snow.download_file(ftp, '/file.nc', path))
            self.assertFalse(snow.download_file(ftp, '/file.nc', path))
            ftp.retrbinary.assert_called_once()
            ftp.retrbinary.side_effect = lambda command, callback: callback(NETCDF[:8])
            with self.assertRaises(ValueError):
                snow.download_file(ftp, '/file.nc', path, overwrite=True)
            self.assertEqual(path.read_bytes(), NETCDF)
            self.assertEqual(list(Path(directory).iterdir()), [path])

    def test_dry_run_never_downloads_and_creates_no_directory(self):
        ftp = self.archive()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'output'
            with patch.object(snow, 'FTP') as constructor:
                constructor.return_value.__enter__.return_value = ftp
                with contextlib.redirect_stdout(io.StringIO()):
                    self.assertEqual(snow.main(['--transport', 'ftp', '--dry-run', '--max-files', '1', '--end-date', '1979-12-31', '--output-dir', str(root)]), 0)
            ftp.retrbinary.assert_not_called()
            self.assertFalse(root.exists())

    def test_https_listing_and_size_are_cached_and_do_not_download_data(self):
        root = snow.BASE_PATH + '/1979/01'
        path = root + '/19790102-ESACCI-L3C_SNOW-SWE-SMMR_NIMBUS7-fv4.0.nc'
        archive = snow.CedaHTTPSArchive(10)
        with patch.object(archive, 'request') as request:
            request.return_value.__enter__.return_value.read.return_value = json.dumps({
                'path': root, 'items': [{'path': path, 'size': len(NETCDF)}],
            })
            self.assertEqual(archive.nlst(root), [path])
            self.assertEqual(archive.size(path), len(NETCDF))
            request.assert_called_once()
            self.assertIn('?json', request.call_args.args[0])

    def test_https_transfer_uses_archive_download_url(self):
        archive = snow.CedaHTTPSArchive(10)
        with patch.object(archive, 'request') as request:
            request.return_value.__enter__.return_value.read.side_effect = [NETCDF, b'']
            callback = Mock()
            archive.retrbinary('RETR ' + snow.BASE_PATH + '/file.nc', callback)
            callback.assert_called_once_with(NETCDF)
            self.assertTrue(request.call_args.args[0].startswith('https://dap.ceda.ac.uk/'))

    def test_https_rejects_unexpected_listing_paths(self):
        archive = snow.CedaHTTPSArchive(10)
        with patch.object(archive, 'request') as request:
            request.return_value.__enter__.return_value.read.return_value = json.dumps({
                'path': snow.BASE_PATH, 'items': [{'path': '/another/archive/file.nc'}],
            })
            with self.assertRaises(ValueError):
                archive.nlst(snow.BASE_PATH)

    def test_shell_wrappers_pass_arguments_from_other_directory(self):
        with tempfile.TemporaryDirectory() as directory:
            import os
            for script, version in [('odp-ftp-water-vapour.sh', 'v4.2'), ('ceda-soil-moisture.sh', 'v9.2'), ('ceda-biomass-agb.sh', 'v7.0'), ('odp-ftp-lakes-temperature.sh', 'v3.0.0')]:
                with self.subTest(script=script):
                    result = subprocess.run(['/bin/bash', str(DOWNLOADS / script), '--help'],
                                            cwd=directory, env=dict(os.environ, PYTHON=sys.executable),
                                            capture_output=True, text=True)
                    self.assertEqual(result.returncode, 0, result.stderr)
                    self.assertIn(version, result.stdout)
                    self.assertIn('--dry-run', result.stdout)

    def test_soil_moisture_entry_point_uses_combined_sm_monthly_v92(self):
        import runpy
        with patch.object(toolbox, 'main', return_value=0) as main:
            with self.assertRaises(SystemExit) as exit:
                runpy.run_path(str(DOWNLOADS / 'toolbox-soil-moisture.py'), run_name='__main__')
        self.assertEqual(exit.exception.code, 0)
        main.assert_called_once_with(
            'esacci.SOILMOISTURE.day.L3S.SSMV.multi-sensor.multi-platform.COMBINED.v09-2.r1',
            'sm', '9.2', 'soil_moisture', 'monthly', '1978-11-01',
        )

    def test_biomass_entry_points_use_direct_ceda_transport(self):
        import runpy
        import ceda_biomass_download
        for filename in ['ceda-biomass-agb.py', 'toolbox-biomass.py']:
            with self.subTest(filename=filename):
                with patch.object(ceda_biomass_download, 'main', return_value=0) as main:
                    with self.assertRaises(SystemExit) as exit:
                        runpy.run_path(str(DOWNLOADS / filename), run_name='__main__')
                self.assertEqual(exit.exception.code, 0)
                main.assert_called_once_with()
        self.assertEqual(ceda_biomass_download.VERSION, '7.0')
        self.assertTrue(ceda_biomass_download.DATASET_ID.endswith('.100m'))

    def test_lakes_entry_points_dispatch_to_direct_ceda_transport(self):
        import runpy
        import ceda_lakes_download
        for filename in ['ceda-lakes-lswt.py', 'toolbox-lakes-lswt.py']:
            with self.subTest(filename=filename):
                with patch.object(ceda_lakes_download, 'main', return_value=0) as main:
                    with self.assertRaises(SystemExit) as exit:
                        runpy.run_path(str(DOWNLOADS / filename), run_name='__main__')
                self.assertEqual(exit.exception.code, 0)
                main.assert_called_once_with()
        self.assertEqual(ceda_lakes_download.VERSION, '3.0.0')
        self.assertEqual(ceda_lakes_download.OUTPUT_VARIABLE, 'lswt')

    def test_biomass_selection_does_not_fabricate_missing_years(self):
        years = list(range(2005, 2013)) + list(range(2015, 2025))
        selected = toolbox.select_timestamps([f'{year}-07-02' for year in years], date(2005, 1, 1), None, 'annual')
        self.assertEqual(len(selected), 18)
        self.assertEqual([instant.year for _, instant in selected], years)
        self.assertNotIn(2013, [instant.year for _, instant in selected])
        self.assertNotIn(2014, [instant.year for _, instant in selected])


if __name__ == '__main__':
    unittest.main()
