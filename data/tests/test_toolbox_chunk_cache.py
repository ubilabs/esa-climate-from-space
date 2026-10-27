import contextlib
import importlib.util
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import Mock, patch


DOWNLOADS = Path(__file__).resolve().parents[1] / 'downloads'
sys.path.insert(0, str(DOWNLOADS))
import toolbox_chunk_cache as cache
from download_utils import atomic_write

DATASET_ID = 'esacci.BIOMASS.yr.L4.AGB.multi-sensor.multi-platform.MERGED.7-0.100m'
HAS_ARRAYS = all(importlib.util.find_spec(name) for name in ('numpy', 'xarray', 'netCDF4', 'dask'))


class CacheUtilityTests(unittest.TestCase):
    def test_edge_windows_cover_grid_once(self):
        self.assertEqual(list(cache.windows(3, 5, (2, 3))), [
            (0, 2, 0, 3), (0, 2, 3, 5), (2, 3, 0, 3), (2, 3, 3, 5)
        ])

    def test_output_lock_excludes_another_downloader_and_releases(self):
        with tempfile.TemporaryDirectory() as directory:
            with cache.output_lock(directory):
                with self.assertRaisesRegex(RuntimeError, 'Another biomass downloader'):
                    with cache.output_lock(directory):
                        self.fail('Concurrent writer acquired lock')
            with cache.output_lock(directory):
                pass

    def test_identity_normalization_handles_nan_and_fingerprint_is_stable(self):
        identity = cache.json_safe({'fill': float('nan'), 'values': (1, 2)})
        self.assertEqual(identity, {'fill': 'nan', 'values': [1, 2]})
        self.assertEqual(cache.fingerprint(identity), cache.fingerprint(json.loads(json.dumps(identity))))


@unittest.skipUnless(HAS_ARRAYS, 'Requires the Toolbox Python environment')
class ChunkCheckpointTests(unittest.TestCase):
    def setUp(self):
        import numpy as np
        import xarray as xr
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.destination = self.root / '20050702.nc'
        values = np.arange(20, dtype='float32').reshape(1, 4, 5)
        values[0, 0, 0] = np.nan
        self.dataset = xr.Dataset(
            {'agb': (('time', 'lat', 'lon'), values), 'crs': ((), 'WGS84')},
            coords={'time': np.array(['2005-07-02T11:59:59'], dtype='datetime64[ns]'),
                    'lat': [50., 51., 52., 53.], 'lon': [10., 11., 12., 13., 14.]}
        )
        self.dataset.agb.attrs.update(units='Mg/ha', grid_mapping='crs')
        self.dataset.agb.encoding.update(dtype='float32', _FillValue=np.nan,
                                         preferred_chunks={'time': 1, 'lat': 2, 'lon': 2})
        self.dataset.crs.encoding['dtype'] = '<U'
        self.metadata = {'data_vars': {'agb': {'attrs': {'grid_mapping': 'crs'}}, 'crs': {}}}
        self.reader = cache.read_remote_block
        self.output = io.StringIO()
        stdout = contextlib.redirect_stdout(self.output)
        stdout.__enter__()
        self.addCleanup(stdout.__exit__, None, None, None)

    def exporter(self, **kwargs):
        return cache.ChunkedExporter(self.root, retries=1, **kwargs)

    def export(self, exporter, dataset=None):
        atomic_write(self.destination, lambda temporary: exporter(
            self.dataset if dataset is None else dataset, 0, 'agb', self.metadata,
            DATASET_ID, 'annual', temporary
        ))

    def seed_failure(self, completed=2):
        reads = []

        def fail_after(dataset, variable, index, window):
            reads.append(window)
            if len(reads) > completed:
                raise OSError('CEDA connection lost')
            return self.reader(dataset, variable, index, window)

        with patch.object(cache, 'read_remote_block', side_effect=fail_after):
            with self.assertRaisesRegex(OSError, 'connection lost'):
                self.export(self.exporter())
        self.assertFalse(self.destination.exists())
        self.assertFalse(list(self.root.glob('*.part')))
        checkpoints = list((self.root / '.chunks/20050702').glob('*.npz'))
        self.assertEqual(len(checkpoints), completed)
        return reads[:completed]

    def assert_final_matches(self):
        import numpy as np
        import xarray as xr
        with xr.open_dataset(self.destination) as output:
            np.testing.assert_allclose(output.agb.values, self.dataset.agb.values, equal_nan=True)
            self.assertEqual(output.sizes['time'], 1)
            self.assertEqual(output.attrs['source_dataset_id'], DATASET_ID)
            self.assertEqual(output.attrs['output_sampling'], 'annual')
            self.assertEqual(output.agb.attrs['units'], 'Mg/ha')
            self.assertIn('crs', output)
            self.assertIn('chunk_cache_fingerprint', output.attrs)

    def test_network_failure_retains_completed_chunks_and_resume_only_reads_missing(self):
        completed = self.seed_failure()
        exporter = self.exporter(keep_chunks=True)
        with patch.object(cache, 'read_remote_block', wraps=self.reader) as read:
            self.export(exporter)
        self.assertEqual(read.call_count, 4)
        self.assertFalse(set(completed) & {call.args[3] for call in read.call_args_list})
        self.assert_final_matches()
        exporter.complete(self.destination)
        self.assertEqual(len(list((self.root / '.chunks/20050702').glob('*.npz'))), 6)

    def test_keyboard_interrupt_retains_finished_chunks(self):
        calls = 0

        def interrupted(dataset, variable, index, window):
            nonlocal calls
            calls += 1
            if calls == 2:
                raise KeyboardInterrupt()
            return self.reader(dataset, variable, index, window)

        with patch.object(cache, 'read_remote_block', side_effect=interrupted):
            with self.assertRaises(KeyboardInterrupt):
                self.export(self.exporter())
        self.assertEqual(len(list((self.root / '.chunks/20050702').glob('*.npz'))), 1)
        self.assertFalse(self.destination.exists())

    def test_local_assembly_failure_retains_all_chunks_and_retry_needs_no_remote_reads(self):
        import toolbox_download
        with patch.object(toolbox_download, 'export_slice', side_effect=OSError('disk write failed')):
            with self.assertRaisesRegex(OSError, 'disk write failed'):
                self.export(self.exporter())
        self.assertFalse(self.destination.exists())
        with patch.object(cache, 'read_remote_block', side_effect=AssertionError('Unexpected remote read')):
            self.export(self.exporter())
        self.assert_final_matches()

    def test_corrupt_checkpoint_is_refetched_without_discarding_other_chunks(self):
        completed = self.seed_failure()
        corrupt = cache.chunk_path(self.root / '.chunks/20050702', completed[0])
        corrupt.write_bytes(b'not an npz')
        with patch.object(cache, 'read_remote_block', wraps=self.reader) as read:
            self.export(self.exporter())
        self.assertEqual(read.call_count, 5)
        self.assertNotIn(completed[1], [call.args[3] for call in read.call_args_list])
        self.assert_final_matches()

    def test_wrong_window_is_refetched_even_if_shape_and_crc_are_valid(self):
        completed = self.seed_failure()
        directory = self.root / '.chunks/20050702'
        cache.chunk_path(directory, completed[0]).write_bytes(cache.chunk_path(directory, completed[1]).read_bytes())
        with patch.object(cache, 'read_remote_block', wraps=self.reader) as read:
            self.export(self.exporter())
        self.assertEqual(read.call_count, 5)
        self.assert_final_matches()

    def test_changed_grid_units_encoding_or_chunk_plan_is_refused(self):
        self.seed_failure()
        for mutation in ('grid', 'units', 'encoding', 'chunks', 'timestamp'):
            with self.subTest(mutation=mutation):
                data = self.dataset.copy(deep=True)
                exporter = self.exporter()
                if mutation == 'grid':
                    data = data.assign_coords(lat=[49., 50., 51., 52.])
                elif mutation == 'units':
                    data.agb.attrs['units'] = 'kg/m2'
                elif mutation == 'encoding':
                    data.agb.encoding['scale_factor'] = 0.1
                elif mutation == 'timestamp':
                    import numpy as np
                    data = data.assign_coords(time=np.array(['2005-07-02T00:00:00'], dtype='datetime64[ns]'))
                else:
                    exporter = self.exporter(size=1)
                with patch.object(cache, 'read_remote_block') as read:
                    with self.assertRaisesRegex(ValueError, 'different source/grid/chunk plan'):
                        self.export(exporter, data)
                read.assert_not_called()
        self.assertEqual(len(list((self.root / '.chunks/20050702').glob('*.npz'))), 2)

    def test_transient_block_read_is_retried_without_restarting_the_year(self):
        calls = 0

        def transient(dataset, variable, index, window):
            nonlocal calls
            calls += 1
            if calls == 2:
                raise OSError('temporary DNS error')
            return self.reader(dataset, variable, index, window)

        exporter = cache.ChunkedExporter(self.root, retries=2)
        with patch.object(cache, 'read_remote_block', side_effect=transient), patch.object(cache.time, 'sleep') as sleep:
            self.export(exporter)
        self.assertEqual(calls, 7)
        sleep.assert_called_once()
        self.assert_final_matches()

    def test_known_chunks_are_cleaned_only_after_publication_and_unknown_files_are_preserved(self):
        exporter = self.exporter()
        self.export(exporter)
        directory = self.root / '.chunks/20050702'
        self.assertEqual(len(list(directory.glob('*.npz'))), 6)
        unrelated = directory / 'user-note.txt'
        unrelated.write_text('retain me')
        exporter.complete(self.destination)
        self.assertTrue(self.destination.exists())
        self.assertEqual(list(directory.iterdir()), [unrelated])

    def test_native_chunks_are_used_and_limits_can_reduce_them(self):
        self.assertEqual(cache.chunk_shape(self.dataset.agb), (2, 2))
        self.assertEqual(cache.chunk_shape(self.dataset.agb, 1), (1, 1))

    def test_failed_chunk_write_is_not_accepted_as_a_checkpoint(self):
        import numpy as np
        directory = self.root / 'cache'
        directory.mkdir()
        path = directory / '000000000-000000000.npz'
        with patch.object(np, 'savez_compressed', side_effect=KeyboardInterrupt):
            with self.assertRaises(KeyboardInterrupt):
                cache.write_chunk(path, np.zeros((1, 2, 2), dtype='float32'), 'key', (0, 2, 0, 2))
        self.assertEqual(list(directory.iterdir()), [])

    def test_checkpoints_are_not_cleaned_if_published_file_is_missing(self):
        exporter = self.exporter()
        self.export(exporter)
        self.destination.unlink()
        with self.assertRaises(FileNotFoundError):
            exporter.complete(self.destination)
        self.assertEqual(len(list((self.root / '.chunks/20050702').glob('*.npz'))), 6)

    def test_packed_encoding_units_crs_and_fill_survive_local_assembly(self):
        import xarray as xr
        self.dataset.agb.encoding.update(dtype='int16', _FillValue=-32768,
                                         scale_factor=0.5, add_offset=0.0)
        self.export(self.exporter())
        self.assert_final_matches()
        with xr.open_dataset(self.destination) as output:
            self.assertEqual(output.agb.encoding['dtype'].name, 'int16')
            self.assertEqual(output.agb.encoding['scale_factor'], 0.5)
            self.assertEqual(output.agb.encoding['_FillValue'], -32768)

    def test_full_cli_resumes_failed_year_and_cleans_cache_after_publication(self):
        import toolbox_download
        store = Mock()
        store.describe_data.return_value.to_dict.return_value = dict(
            self.metadata, attrs={'product_version': '7.0'}, time_range=['2005-01-01', '2005-12-31'])
        store.open_data.return_value = self.dataset
        args = ['--max-files', '1', '--chunk-retries', '1', '--output-dir', str(self.root)]

        def fail_after_first(dataset, variable, index, window):
            if window != (0, 2, 0, 2):
                raise OSError('CEDA disconnected')
            return self.reader(dataset, variable, index, window)

        def run():
            return toolbox_download.main(DATASET_ID, 'agb', '7.0', 'biomass', 'annual',
                                         '2005-01-01', args, chunked=True)

        with patch.object(toolbox_download, 'get_store', return_value=store):
            with patch.object(cache, 'read_remote_block', side_effect=fail_after_first), \
                    contextlib.redirect_stderr(self.output):
                self.assertEqual(run(), 1)
            self.assertEqual(len(list((self.root / '.chunks/20050702').glob('*.npz'))), 1)
            self.assertFalse(self.destination.exists())
            with patch.object(cache, 'read_remote_block', wraps=self.reader) as read:
                self.assertEqual(run(), 0)
            self.assertEqual(read.call_count, 5)
        self.assert_final_matches()
        self.assertFalse((self.root / '.chunks/20050702').exists())


if __name__ == '__main__':
    unittest.main()
