import contextlib
from datetime import date
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import HTTPError


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'downloads'))
import ceda_lakes_download as lakes


PAYLOAD = b'CDF\x01' + b'complete daily NetCDF test payload'


def entry(stamp=date(1995, 6, 1)):
    name = f'ESACCI-LAKES-L3S-LK_PRODUCTS-MERGED-{stamp:%Y%m%d}-fv3.0.0.nc'
    return {'name': name, 'path': f'{lakes.ARCHIVE_PATH}/{stamp:%Y/%m}/{name}',
            'date': stamp, 'size': len(PAYLOAD), 'md5': hashlib.md5(PAYLOAD).hexdigest(),
            'url': 'https://dap.ceda.ac.uk/example/' + name}


def legacy_identity(bbox=None):
    return {'dataset_id': lakes.REFERENCE_ID, 'version': '3.0.0', 'variable': lakes.VARIABLE,
            'sampling': 'monthly', 'bbox': bbox, 'store_id': 'esa-cci-zarr', 'output_variable': 'lswt'}


class ArchiveTests(unittest.TestCase):
    def listing(self):
        first = entry()
        later = entry(date(1995, 6, 2))
        path = f'{lakes.ARCHIVE_PATH}/1995/06'
        return {'path': path, 'items': [later, first]}

    def test_selects_real_earliest_monthly_file_and_pinned_url(self):
        with patch.object(lakes, 'request', return_value=io.BytesIO(json.dumps(self.listing(), default=str).encode())):
            with contextlib.redirect_stdout(io.StringIO()):
                selected = list(lakes.monthly_files(date(1995, 6, 1), date(1995, 6, 30), 10))
        self.assertEqual(len(selected), 1)
        self.assertEqual(selected[0]['date'], date(1995, 6, 1))
        self.assertIn('/1995/06/', selected[0]['url'])
        self.assertTrue(selected[0]['url'].endswith('-fv3.0.0.nc?download=1'))

    def test_partial_date_ranges_do_not_create_a_second_snapshot_in_one_month(self):
        with patch.object(lakes, 'request', return_value=io.BytesIO(json.dumps(self.listing(), default=str).encode())):
            with contextlib.redirect_stdout(io.StringIO()):
                selected = list(lakes.monthly_files(date(1995, 6, 2), date(1995, 6, 30), 10))
        self.assertEqual(selected, [])

    def test_invalid_file_path_cannot_escape_release_directory(self):
        listing = self.listing()
        listing['items'][0]['path'] = '/another/version/file.nc'
        with patch.object(lakes, 'request', return_value=io.BytesIO(json.dumps(listing, default=str).encode())):
            with contextlib.redirect_stdout(io.StringIO()), self.assertRaises(ValueError):
                list(lakes.monthly_files(date(1995, 6, 1), date(1995, 6, 30), 10))

    def test_download_size_checksum_cache_and_atomic_validation(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'source.nc'
            with patch.object(lakes, 'request', return_value=io.BytesIO(PAYLOAD)) as request:
                with contextlib.redirect_stdout(io.StringIO()):
                    lakes.download_source(entry(), path, 10, 1)
                    lakes.download_source(entry(), path, 10, 1)
            request.assert_called_once()
            self.assertEqual(path.read_bytes(), PAYLOAD)
            self.assertEqual(list(Path(directory).iterdir()), [path])

    def test_bad_checksum_never_publishes_source(self):
        bad = entry()
        bad['md5'] = '0' * 32
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'source.nc'
            with patch.object(lakes, 'request', return_value=io.BytesIO(PAYLOAD)):
                with contextlib.redirect_stdout(io.StringIO()), self.assertRaises(ValueError):
                    lakes.download_source(bad, path, 10, 1)
            self.assertFalse(path.exists())
            self.assertEqual(list(Path(directory).iterdir()), [])

    def test_transient_http_failure_retries_without_partial_files(self):
        error = HTTPError('url', 503, 'Busy', {'Retry-After': '0'}, None)
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'source.nc'
            with patch.object(lakes, 'request', side_effect=[error, io.BytesIO(PAYLOAD)]) as request:
                with patch.object(lakes.time, 'sleep') as sleep, contextlib.redirect_stdout(io.StringIO()):
                    lakes.download_source(entry(), path, 10, 2)
            self.assertEqual(request.call_count, 2)
            sleep.assert_called_once()
            self.assertEqual(path.read_bytes(), PAYLOAD)


class OutputTests(unittest.TestCase):
    def test_known_zarr_manifest_is_backed_up_and_migrated_without_removing_partials(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            manifest = root / 'download-manifest.json'
            manifest.write_text(json.dumps(legacy_identity()))
            partial = root / '.19950601.nc.old.part'
            partial.write_bytes(b'old incomplete export')
            with contextlib.redirect_stdout(io.StringIO()):
                lakes.prepare_lakes_output(root, None, dry_run=False)
            self.assertEqual(json.loads(manifest.read_text()), lakes.output_identity(None))
            self.assertEqual(json.loads((root / 'download-manifest.zarr-backup.json').read_text()), legacy_identity())
            self.assertEqual(partial.read_bytes(), b'old incomplete export')

    def test_manifest_dry_run_changes_nothing(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            manifest = root / 'download-manifest.json'
            original = json.dumps(legacy_identity())
            manifest.write_text(original)
            with contextlib.redirect_stdout(io.StringIO()):
                lakes.prepare_lakes_output(root, None, dry_run=True)
            self.assertEqual(manifest.read_text(), original)
            self.assertEqual(list(root.iterdir()), [manifest])

    def test_unrelated_manifest_is_not_adopted(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'download-manifest.json').write_text(json.dumps({'version': '2.0.2'}))
            with self.assertRaises(ValueError):
                lakes.prepare_lakes_output(root, None, dry_run=False)

    def test_lock_prevents_two_new_downloaders_from_writing_together(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            with lakes.output_lock(root):
                with self.assertRaises(RuntimeError):
                    with lakes.output_lock(root):
                        pass
            with lakes.output_lock(root):
                pass

    def test_cli_dry_run_does_not_download_or_create_directory(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'new'
            with patch.object(lakes, 'monthly_files', return_value=iter([entry()])):
                with patch.object(lakes, 'download_source') as download:
                    with contextlib.redirect_stdout(io.StringIO()):
                        self.assertEqual(lakes.main(['--dry-run', '--max-files', '1', '--output-dir', str(root)]), 0)
            download.assert_not_called()
            self.assertFalse(root.exists())

    def test_cli_streams_extracts_cleans_source_and_resumes(self):
        def download(item, destination, *args, **kwargs):
            destination.write_bytes(PAYLOAD)
        def extract(source, destination, *args, **kwargs):
            self.assertEqual(source.read_bytes(), PAYLOAD)
            destination.write_bytes(PAYLOAD)
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'new'
            args = ['--output-dir', str(root), '--max-files', '1']
            with patch.object(lakes, 'monthly_files', side_effect=lambda *args: iter([entry()])):
                with patch.object(lakes, 'download_source', side_effect=download) as transfer:
                    with patch.object(lakes, 'extract_lswt', side_effect=extract) as copy:
                        with contextlib.redirect_stdout(io.StringIO()):
                            self.assertEqual(lakes.main(args), 0)
                        self.assertEqual((root / '19950601.nc').read_bytes(), PAYLOAD)
                        self.assertEqual(list((root / '.source-cache').iterdir()), [])
                        with patch.object(lakes, 'validate_output', return_value=True):
                            with contextlib.redirect_stdout(io.StringIO()):
                                self.assertEqual(lakes.main(args), 0)
                        self.assertEqual(transfer.call_count, 1)
                        self.assertEqual(copy.call_count, 1)


@unittest.skipUnless(importlib.util.find_spec('netCDF4') and importlib.util.find_spec('numpy'), 'Requires the Toolbox Python environment')
class PackedExtractionTests(unittest.TestCase):
    def make_source(self, path, version='v3.0.0'):
        import netCDF4
        import numpy as np
        raw = np.array([[[1000, -32768, -32768, -32768, 1200, 1300],
                         [1400, 1500, 1600, 1700, 1800, 1900],
                         [-32768, -32768, 2000, 2100, 2200, 2300],
                         [-32768, -32768, 2400, 2500, 2600, 2700]]], dtype='int16')
        with netCDF4.Dataset(path, 'w') as ds:
            for dim, length in [('time', 1), ('lat', 4), ('lon', 6), ('nv', 2)]:
                ds.createDimension(dim, length)
            ds.product_version = version
            t = ds.createVariable('time', 'f8', ('time',))
            t.units = 'hours since 1995-06-01 00:00:00'
            t.calendar = 'standard'
            t.bounds = 'time_bounds'
            t[:] = [12]
            ds.createVariable('time_bounds', 'f8', ('time', 'nv'))[:] = [[0, 24]]
            ds.createVariable('lat', 'f4', ('lat',))[:] = [45, 44, 43, 42]
            ds.createVariable('lon', 'f4', ('lon',))[:] = [10, 11, 12, 13, 14, 15]
            crs = ds.createVariable('crs', 'i4')
            crs.grid_mapping_name = 'latitude_longitude'
            crs[...] = 0
            temperature = ds.createVariable(lakes.VARIABLE, 'i2', ('time', 'lat', 'lon'), fill_value=-32768)
            temperature.units = 'kelvin'
            temperature.grid_mapping = 'crs'
            temperature.ancillary_variables = 'lswt_quality_level lswt_uncertainty'
            temperature.scale_factor = 0.01
            temperature.add_offset = 273.15
            temperature.set_auto_maskandscale(False)
            temperature[:] = raw
        return raw

    def test_raw_packing_alias_fill_coordinates_crs_and_provenance_are_preserved(self):
        import netCDF4
        import numpy as np
        with tempfile.TemporaryDirectory() as directory:
            source, output = Path(directory) / 'source.nc', Path(directory) / 'output.nc'
            raw = self.make_source(source)
            with contextlib.redirect_stdout(io.StringIO()) as log:
                lakes.extract_lswt(source, output, entry(), block_size=2)
            with netCDF4.Dataset(output) as ds:
                self.assertEqual(len(ds.dimensions['time']), 1)
                self.assertIn('time_bounds', ds.variables)
                self.assertIn('crs', ds.variables)
                self.assertNotIn(lakes.VARIABLE, ds.variables)
                self.assertEqual(ds.download_transport, 'ceda-netcdf')
                self.assertEqual(ds.source_url, entry()['url'])
                v = ds.variables['lswt']
                self.assertEqual(v.units, 'kelvin')
                self.assertNotIn('ancillary_variables', v.ncattrs())
                self.assertEqual(v.scale_factor, 0.01)
                self.assertEqual(v.add_offset, 273.15)
                v.set_auto_maskandscale(False)
                np.testing.assert_array_equal(v[:], raw)
            self.assertIn('100.0%', log.getvalue())
            self.assertTrue(lakes.validate_output(output, date(1995, 6, 1)))

    def test_bbox_crop_copies_raw_values_without_decoding_a_global_array(self):
        import netCDF4
        import numpy as np
        with tempfile.TemporaryDirectory() as directory:
            source, output = Path(directory) / 'source.nc', Path(directory) / 'output.nc'
            raw = self.make_source(source)
            with contextlib.redirect_stdout(io.StringIO()):
                lakes.extract_lswt(source, output, entry(), [11.5, 42.5, 13.5, 44.5], block_size=2)
            with netCDF4.Dataset(output) as ds:
                v = ds.variables['lswt']
                v.set_auto_maskandscale(False)
                np.testing.assert_array_equal(v[:], raw[:, 1:3, 2:4])
                np.testing.assert_array_equal(ds.variables['lat'][:], [44, 43])
                np.testing.assert_array_equal(ds.variables['lon'][:], [12, 13])

    def test_wrong_version_or_date_is_rejected_before_output(self):
        with tempfile.TemporaryDirectory() as directory:
            source, output = Path(directory) / 'source.nc', Path(directory) / 'output.nc'
            self.make_source(source, version='v2.0.2')
            with self.assertRaises(ValueError):
                lakes.extract_lswt(source, output, entry())
            self.assertFalse(output.exists())
            source.unlink()
            self.make_source(source)
            with self.assertRaises(ValueError):
                lakes.extract_lswt(source, output, entry(date(1995, 6, 2)))
            self.assertFalse(output.exists())


if __name__ == '__main__':
    unittest.main()
