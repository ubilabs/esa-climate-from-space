import contextlib
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
import io
import json
from pathlib import Path
import sys
import tempfile
import threading
import unittest
from unittest.mock import patch
from urllib.error import HTTPError


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'downloads'))
import ceda_biomass_download as biomass


PAYLOAD = b'CDF\x01' + b'original packed NetCDF with AGB and uncertainty'


def entry(year=2005):
    name = f'ESACCI-BIOMASS-L4-AGB-MERGED-100m-{year}-fv7.0.nc'
    return {'year': year, 'name': name, 'size': len(PAYLOAD),
            'md5': hashlib.md5(PAYLOAD).hexdigest(),
            'url': 'https://dap.ceda.ac.uk' + biomass.ARCHIVE_PATH + '/' + name + '?download=1'}


def listing():
    items = []
    for year in reversed(biomass.YEARS):
        item = entry(year)
        items.append(dict(item, path=biomass.ARCHIVE_PATH + '/' + item['name'], type='file'))
    items.append({'name': 'ESACCI-BIOMASS-L4-AGB-MERGED-1000m-fv7.0.nc'})
    items.append({'name': 'ESACCI-BIOMASS-L4-AGB-CHANGE-100m-2020-2010-fv7.0.nc'})
    items.append({'name': 'ESACCI-BIOMASS-L4-AGB-MERGED-100m-2005-fv5.01.nc'})
    return {'path': biomass.ARCHIVE_PATH, 'items': items}


class Response(io.BytesIO):
    def __init__(self, payload=PAYLOAD, status=206, offset=0, total=len(PAYLOAD), headers=None):
        super().__init__(payload)
        self.status = status
        self.headers = {'Content-Length': str(len(payload)),
                        'Content-Range': f'bytes {offset}-{total - 1}/{total}', **(headers or {})}


class DiscoveryTests(unittest.TestCase):
    def discover(self, data):
        with patch.object(biomass, 'request', return_value=io.BytesIO(json.dumps(data).encode())):
            return biomass.discover_files(10)

    def test_selects_only_all_18_native_annual_merged_maps_in_order(self):
        with contextlib.redirect_stdout(io.StringIO()):
            entries = self.discover(listing())
        self.assertEqual([item['year'] for item in entries], list(biomass.YEARS))
        self.assertEqual(entries[0], entry())

    def test_missing_years_duplicates_wrong_paths_and_bad_checksums_fail_closed(self):
        for mutation in ['missing', 'duplicate', 'path', 'checksum', 'size', 'root']:
            with self.subTest(mutation=mutation):
                data = listing()
                if mutation == 'missing':
                    data['items'].pop(0)
                elif mutation == 'duplicate':
                    data['items'].append(data['items'][0])
                elif mutation == 'path':
                    data['items'][0]['path'] = '/another/release/file.nc'
                elif mutation == 'checksum':
                    data['items'][0]['md5'] = None
                elif mutation == 'size':
                    data['items'][0]['size'] = -1
                else:
                    data['path'] = '/another/release'
                with contextlib.redirect_stdout(io.StringIO()), self.assertRaises(ValueError):
                    self.discover(data)

    def test_ceda_unpadded_hex_checksum_is_normalized(self):
        data = listing()
        data['items'][0]['md5'] = '123abc'
        with contextlib.redirect_stdout(io.StringIO()):
            entries = self.discover(data)
        self.assertEqual(entries[-1]['md5'], '123abc'.zfill(32))


class TransferTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.destination = self.root / '20050101.nc'
        self.stdout = contextlib.redirect_stdout(io.StringIO())
        self.stdout.__enter__()
        self.addCleanup(self.stdout.__exit__, None, None, None)

    def download(self, item=None, **kwargs):
        with patch.object(biomass, 'validate_metadata', return_value=True):
            biomass.download_file(item or entry(), self.destination, 10, 2, **kwargs)

    def seed_partial(self, size=12):
        partial, manifest = biomass.prepare_partial(self.destination, entry())
        partial.write_bytes(PAYLOAD[:size])
        return partial, manifest

    def test_download_keeps_original_bytes_and_publishes_only_after_validation(self):
        with patch.object(biomass, 'request', return_value=Response()) as request:
            self.download()
        self.assertEqual(self.destination.read_bytes(), PAYLOAD)
        self.assertEqual(list(self.root.iterdir()), [self.destination])
        request.assert_called_once_with(entry()['url'], 10, {'Range': 'bytes=0-'})

    def test_resume_appends_only_the_requested_remaining_bytes(self):
        self.seed_partial()
        with patch.object(biomass, 'request', return_value=Response(PAYLOAD[12:], offset=12)) as request:
            self.download()
        self.assertEqual(request.call_args.args[2], {'Range': 'bytes=12-'})
        self.assertEqual(self.destination.read_bytes(), PAYLOAD)

    def test_server_ignoring_range_restarts_without_duplicate_bytes(self):
        self.seed_partial()
        with patch.object(biomass, 'request', return_value=Response(status=200)):
            self.download()
        self.assertEqual(self.destination.read_bytes(), PAYLOAD)

    def test_bad_range_size_or_encoding_cannot_corrupt_existing_partial(self):
        partial, _ = self.seed_partial()
        for headers in [{'Content-Range': f'bytes 0-{len(PAYLOAD) - 1}/{len(PAYLOAD)}'},
                        {'Content-Length': '1'}, {'Content-Encoding': 'gzip'}]:
            with self.subTest(headers=headers):
                with patch.object(biomass, 'request', return_value=Response(PAYLOAD[12:], offset=12, headers=headers)):
                    with self.assertRaises(ValueError):
                        self.download()
                self.assertEqual(partial.read_bytes(), PAYLOAD[:12])
                self.assertFalse(self.destination.exists())

    def test_truncated_transfer_resumes_on_retry(self):
        with patch.object(biomass, 'request', side_effect=[
                Response(PAYLOAD[:12], headers={'Content-Length': str(len(PAYLOAD))}),
                Response(PAYLOAD[12:], offset=12)]) as request:
            with patch.object(biomass.time, 'sleep'):
                self.download()
        self.assertEqual(request.call_args.args[2], {'Range': 'bytes=12-'})
        self.assertEqual(self.destination.read_bytes(), PAYLOAD)

    def test_transient_http_error_retries_but_permanent_error_does_not(self):
        with patch.object(biomass, 'request', side_effect=[
                HTTPError('url', 503, 'Busy', {'Retry-After': '0'}, None), Response()]) as request:
            with patch.object(biomass.time, 'sleep'):
                self.download()
        self.assertEqual(request.call_count, 2)
        self.destination.unlink()
        with patch.object(biomass, 'request', side_effect=HTTPError('url', 403, 'Forbidden', {}, None)) as request:
            with self.assertRaises(HTTPError):
                self.download()
        self.assertEqual(request.call_count, 1)
        self.assertFalse(self.destination.exists())

    def test_keyboard_interrupt_retains_partial_and_identity(self):
        partial, manifest = self.seed_partial()
        with patch.object(biomass, 'request', side_effect=KeyboardInterrupt):
            with self.assertRaises(KeyboardInterrupt):
                self.download()
        self.assertEqual(partial.read_bytes(), PAYLOAD[:12])
        self.assertEqual(json.loads(manifest.read_text()), entry())
        self.assertFalse(self.destination.exists())

    def test_checksum_failure_never_publishes_and_does_not_destroy_old_output(self):
        self.destination.write_bytes(b'previous complete output')
        bad = dict(entry(), md5='0' * 32)
        with patch.object(biomass, 'request', return_value=Response()):
            with self.assertRaises(ValueError):
                self.download(bad, overwrite=True)
        self.assertEqual(self.destination.read_bytes(), b'previous complete output')
        partial, manifest = biomass.partial_paths(self.destination)
        self.assertEqual(partial.read_bytes(), PAYLOAD)
        self.assertTrue(manifest.exists())

    def test_invalid_metadata_does_not_publish(self):
        with patch.object(biomass, 'request', return_value=Response()):
            with patch.object(biomass, 'validate_metadata', return_value=False):
                with self.assertRaises(ValueError):
                    biomass.download_file(entry(), self.destination, 10, 1)
        self.assertFalse(self.destination.exists())

    def test_complete_partial_is_verified_and_published_without_redownloading(self):
        self.seed_partial(len(PAYLOAD))
        with patch.object(biomass, 'request') as request:
            self.download()
        request.assert_not_called()
        self.assertEqual(self.destination.read_bytes(), PAYLOAD)

    def test_unknown_or_mismatched_partials_are_not_adopted(self):
        partial, manifest = biomass.partial_paths(self.destination)
        partial.write_bytes(PAYLOAD[:12])
        with self.assertRaises(ValueError):
            biomass.prepare_partial(self.destination, entry())
        manifest.write_text(json.dumps(dict(entry(), md5='0' * 32)))
        with self.assertRaises(ValueError):
            biomass.prepare_partial(self.destination, entry())
        self.assertEqual(partial.read_bytes(), PAYLOAD[:12])

    def test_atomic_publication_never_clobbers_without_overwrite(self):
        self.destination.write_bytes(b'other writer')
        with patch.object(biomass, 'request', return_value=Response()):
            with self.assertRaises(FileExistsError):
                self.download()
        self.assertEqual(self.destination.read_bytes(), b'other writer')


class OutputTests(unittest.TestCase):
    def test_default_output_is_separate_from_toolbox_checkpoints(self):
        with patch.object(biomass, 'discover_files', return_value=[entry()]), \
                patch.object(biomass, 'prepare_output'), \
                patch.object(biomass, 'prepare_biomass_output') as prepare, \
                patch.object(biomass, 'download_file') as download, \
                contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(biomass.main(['--dry-run', '--max-files', '1']), 0)
        self.assertEqual(prepare.call_args.args[0], biomass.DOWNLOAD_ROOT / 'biomass-ceda/v7.0')
        self.assertTrue(prepare.call_args.kwargs['dry_run'])
        download.assert_not_called()

    def test_known_manifest_migration_preserves_backup_and_old_partials(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            manifest = root / 'download-manifest.json'
            manifest.write_text(json.dumps(biomass.LEGACY_IDENTITY))
            partial = root / '.20050101.nc.old.part'
            partial.write_bytes(b'old incomplete toolbox export')
            with contextlib.redirect_stdout(io.StringIO()):
                biomass.prepare_biomass_output(root, [entry()], dry_run=True)
                self.assertEqual(json.loads(manifest.read_text()), biomass.LEGACY_IDENTITY)
                biomass.prepare_biomass_output(root, [entry()], dry_run=False)
            self.assertEqual(json.loads(manifest.read_text()), biomass.IDENTITY)
            self.assertEqual(json.loads((root / 'download-manifest.toolbox-backup.json').read_text()), biomass.LEGACY_IDENTITY)
            self.assertEqual(partial.read_bytes(), b'old incomplete toolbox export')

    def test_unrelated_manifest_and_unknown_completed_outputs_are_refused(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            manifest = root / 'download-manifest.json'
            manifest.write_text(json.dumps({'version': '5.01'}))
            with self.assertRaises(ValueError):
                biomass.prepare_biomass_output(root, [entry()], dry_run=False)
            manifest.write_text(json.dumps(biomass.LEGACY_IDENTITY))
            (root / 'unknown.nc').write_bytes(PAYLOAD)
            with self.assertRaises(ValueError):
                biomass.prepare_biomass_output(root, [entry()], dry_run=False)
            self.assertEqual(json.loads(manifest.read_text()), biomass.LEGACY_IDENTITY)

    def test_output_lock_excludes_another_new_downloader(self):
        with tempfile.TemporaryDirectory() as directory:
            with biomass.output_lock(Path(directory)):
                with self.assertRaises(RuntimeError):
                    with biomass.output_lock(Path(directory)):
                        pass

    def test_cli_dry_run_filters_dates_limits_files_and_changes_nothing(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'new'
            with patch.object(biomass, 'discover_files', return_value=[entry(year) for year in biomass.YEARS]):
                with patch.object(biomass, 'download_file') as download:
                    with contextlib.redirect_stdout(io.StringIO()) as output:
                        result = biomass.main(['--dry-run', '--start-date', '2010-01-01', '--max-files', '1', '--output-dir', str(root)])
            self.assertEqual(result, 0)
            self.assertIn('PLAN 20100101.nc', output.getvalue())
            self.assertNotIn('PLAN 20110101.nc', output.getvalue())
            download.assert_not_called()
            self.assertFalse(root.exists())

    def test_bbox_is_rejected_before_any_network_access(self):
        with patch.object(biomass, 'discover_files') as discover:
            with contextlib.redirect_stderr(io.StringIO()):
                self.assertEqual(biomass.main(['--bbox', '10', '40', '11', '41']), 1)
        discover.assert_not_called()


@unittest.skipUnless(importlib.util.find_spec('netCDF4'), 'Requires the Toolbox Python environment')
class MetadataTests(unittest.TestCase):
    def test_real_http_range_resume_and_cli_publication_preserve_original_netcdf(self):
        import netCDF4
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / 'source.nc'
            with netCDF4.Dataset(source, 'w') as ds:
                for name, size in [('time', 1), ('lat', 157500), ('lon', 405000)]:
                    ds.createDimension(name, size)
                ds.product_version = '7.0'
                agb = ds.createVariable('agb', 'i2', ('time', 'lat', 'lon'), zlib=True,
                                        chunksizes=(1, 512, 512), fill_value=-32768)
                agb.units = 'Mg/ha'
                instant = ds.createVariable('time', 'f8', ('time',))
                instant.units = 'days since 2005-01-01'
                instant[:] = [0]
            payload = source.read_bytes()
            requests = []

            class Handler(BaseHTTPRequestHandler):
                def do_GET(self):
                    requests.append(self.headers.get('Range'))
                    offset = int(self.headers['Range'].removeprefix('bytes=').removesuffix('-'))
                    self.send_response(206)
                    self.send_header('Content-Range', f'bytes {offset}-{len(payload) - 1}/{len(payload)}')
                    self.send_header('Content-Length', str(len(payload) - offset))
                    self.end_headers()
                    self.wfile.write(payload[offset:])

                def log_message(self, *args):
                    pass

            server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                item = dict(entry(), size=len(payload), md5=hashlib.md5(payload).hexdigest(),
                            url=f'http://127.0.0.1:{server.server_port}/source.nc')
                output = root / 'output'
                output.mkdir()
                manifest = output / 'download-manifest.json'
                manifest.write_text(json.dumps(biomass.LEGACY_IDENTITY))
                destination = output / '20050101.nc'
                partial, _ = biomass.prepare_partial(destination, item)
                partial.write_bytes(payload[:512])
                with patch.object(biomass, 'discover_files', return_value=[item]):
                    with contextlib.redirect_stdout(io.StringIO()):
                        args = ['--max-files', '1', '--output-dir', str(output)]
                        self.assertEqual(biomass.main(args), 0)
                        self.assertEqual(biomass.main(args), 0)
                self.assertEqual(requests, ['bytes=512-'])
                self.assertEqual(destination.read_bytes(), payload)
                self.assertFalse(partial.exists())
                self.assertEqual(json.loads(manifest.read_text()), biomass.IDENTITY)
                self.assertTrue((output / 'download-manifest.toolbox-backup.json').exists())
            finally:
                server.shutdown()
                server.server_close()
                thread.join()

    def test_native_grid_time_version_units_and_legacy_provenance(self):
        import netCDF4
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'native.nc'
            # Unallocated compressed data: realistic shape, no global array.
            with netCDF4.Dataset(path, 'w') as ds:
                for name, size in [('time', 1), ('lat', 157500), ('lon', 405000)]:
                    ds.createDimension(name, size)
                ds.product_version = '7.0'
                agb = ds.createVariable('agb', 'i2', ('time', 'lat', 'lon'), zlib=True,
                                        chunksizes=(1, 512, 512), fill_value=-32768)
                agb.units = 'Mg/ha'
                instant = ds.createVariable('time', 'f8', ('time',))
                instant.units = 'days since 2005-01-01'
                instant[:] = [0]
            self.assertLess(path.stat().st_size, 100000)
            self.assertTrue(biomass.validate_metadata(path, 2005))
            self.assertFalse(biomass.validate_metadata(path, 2006))
            self.assertFalse(biomass.validate_metadata(path, 2005, legacy=True))
            with netCDF4.Dataset(path, 'a') as ds:
                ds.source_dataset_id = biomass.DATASET_ID
                ds.output_sampling = 'annual'
            self.assertTrue(biomass.validate_metadata(path, 2005, legacy=True))
            with netCDF4.Dataset(path, 'a') as ds:
                ds.product_version = '5.01'
            self.assertFalse(biomass.validate_metadata(path, 2005))


if __name__ == '__main__':
    unittest.main()
