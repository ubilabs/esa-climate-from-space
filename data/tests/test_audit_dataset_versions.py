import argparse
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
import subprocess
from urllib.error import HTTPError
from unittest.mock import patch


SCRIPT = Path(__file__).resolve().parents[1] / 'audit-dataset-versions.py'
SPEC = importlib.util.spec_from_file_location('audit_dataset_versions', SCRIPT)
audit = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(audit)


def layer(layer_id, version='1.0'):
    description = '' if version is None else f'**Version:** {version}  \n'
    return {'id': layer_id, 'name': layer_id, 'description': description}


def dual_catalogue(ceda, toolbox=None, live=True):
    return {'ids': ceda, 'ceda_ids': ceda, 'toolbox_ids': toolbox if toolbox is not None else ceda,
            'source': 'test catalogue', 'checked_live': live, 'warnings': []}


def verified_check(data_id, timeout):
    return {'id': data_id, 'verified': True}


def sample_timestamps(data_id, timeout):
    return ['2000-01-01T00:00:00.000000000Z']


class VersionTests(unittest.TestCase):
    def test_description_version(self):
        self.assertEqual(audit.documented_version('Text\n**VERSION:** v4.0  \nMore'), 'v4.0')
        self.assertIsNone(audit.documented_version('version 99 in prose'))
        self.assertIsNone(audit.documented_version('**Version:**   \n**DOI:** not a version'))

    def test_numeric_not_lexical_comparison(self):
        self.assertGreater(audit.version_key('v10-0'), audit.version_key('9.2'))
        self.assertEqual(audit.version_key('05-0'), audit.version_key('5.0.0'))
        self.assertEqual(audit.version_key('v2-0-2'), (2, 0, 2))

    def test_opaque_versions_are_not_inferred(self):
        for value in ['fv0100', 'fv0002', '2.0.7b', 'unknown', 'v1.0rc1']:
            with self.subTest(value=value):
                self.assertIsNone(audit.version_key(value))


class MatchingTests(unittest.TestCase):
    def test_newer_soil_moisture_excludes_other_products(self):
        prefix = 'esacci.SOILMOISTURE.day.L3S.SSMV.multi-sensor.multi-platform.'
        ids = [prefix + 'COMBINED.v09-1.r1', prefix + 'COMBINED.v09-2.r1',
               prefix + 'PASSIVE.v99-0.r1', prefix + 'COMBINED_ADJUSTED.v99-0.r1']
        result = audit.audit_layer(layer('soil_moisture.sm', '9.1'), ids)
        self.assertEqual(result['status'], 'newer-listed')
        self.assertEqual(result['available_versions'], ['9.1', '9.2'])
        self.assertEqual(result['latest_listed_version'], '9.2')

    def test_permafrost_excludes_antarctic_back_extension_and_alt(self):
        prefix = 'esacci.PERMAFROST.yr.L4.'
        ids = [prefix + 'PFR.multi-sensor.multi-platform.MODISLST_CRYOGRID.04-0.r1',
               prefix + 'PFR.multi-sensor.multi-platform.MODISLST_CRYOGRID.05-0.NH',
               prefix + 'PFR.multi-sensor.multi-platform.MODISLST_CRYOGRID.99-0.Antarctic',
               prefix + 'PFR.multi-sensor.multi-platform.ERA5_MODISLST_BIASCORRECTED.99-0.NH',
               prefix + 'ALT.multi-sensor.multi-platform.MODISLST_CRYOGRID.99-0.NH']
        result = audit.audit_layer(layer('permafrost.PFR', 'v4.0'), ids)
        self.assertEqual(result['latest_listed_version'], '5.0')
        self.assertEqual(len(result['matches']), 2)

    def test_matching_family_up_to_date(self):
        ids = ['esacci.FIRE.mon.L4.BA.MODIS.Terra.MODIS_TERRA.v5-1.grid',
               'esacci.FIRE.mon.L4.BA.multi-sensor.multi-platform.mr_har.v99-0.grid']
        result = audit.audit_layer(layer('fire.burned_area', '5.1'), ids)
        self.assertEqual(result['status'], 'up-to-date')
        self.assertEqual(len(result['matches']), 1)

    def test_older_catalogue_does_not_recommend_downgrade(self):
        ids = ['esacci.SST.day.L4.SSTdepth.multi-sensor.multi-platform.OSTIA.2-1.sst']
        result = audit.audit_layer(layer('sst.analysed_sst', '3.0'), ids)
        self.assertEqual(result['status'], 'catalogue-behind')

    def test_sst_excludes_climatology_and_anomaly(self):
        ids = ['esacci.SST.climatology.L4.SSTdepth.multi-sensor.multi-platform.Climatology.99-0.r1',
               'esacci.SST.day.L4.SSTdepth.multi-sensor.multi-platform.OSTIA.99-0.anomaly']
        self.assertEqual(audit.audit_layer(layer('sst.analysed_sst'), ids)['status'], 'not-listed')

    def test_biomass_uses_100m_merged_only(self):
        prefix = 'esacci.BIOMASS.yr.L4.AGB.multi-sensor.multi-platform.'
        ids = [prefix + 'MERGED.7-0.100m', prefix + 'MERGED.99-0.10000m',
               prefix + 'CHANGE.99-0.100m', prefix + 'DIFF.99-0.r1']
        result = audit.audit_layer(layer('biomass.agb', '5.01'), ids)
        self.assertEqual(result['latest_listed_version'], '7.0')
        self.assertEqual(len(result['matches']), 1)

    def test_mixed_project_version_compares_highest(self):
        ids = ['esacci.SEASTATE.mon.L4.SWH.multi-sensor.multi-platform.MULTI_1M.4-0.r1']
        result = audit.audit_layer(layer('sea_state.swh_mean', '1.1 + 3'), ids)
        self.assertEqual(result['status'], 'newer-listed')

    def test_confirmed_lakes_label_maps_to_202_without_changing_display(self):
        ids = ['esacci.LAKES.day.L3S.LK_PRODUCTS.multi-sensor.multi-platform.MERGED.v3-0-0.r1']
        result = audit.audit_layer(layer('lakes.lswt', 'v2.02'), ids)
        self.assertEqual(result['status'], 'newer-listed')
        self.assertEqual(result['project_version'], 'v2.02')
        self.assertEqual(result['latest_listed_version'], '3.0.0')
        self.assertEqual(audit.project_release('lakes.lswt', 'v2.02'), '2.0.2')
        self.assertEqual(audit.project_release('another.product', 'v2.02'), 'v2.02')

    def test_compact_ozone_code_is_not_version_100(self):
        ids = ['esacci.OZONE.day.L3S.TC.multi-sensor.multi-platform.MERGED.fv0100.r1']
        result = audit.audit_layer(layer('ozone.total_ozone_column', '1'), ids)
        self.assertEqual(result['status'], 'review-needed')
        self.assertIsNone(result['latest_listed_version'])

    def test_missing_version_and_unknown_layer(self):
        ids = ['esacci.SNOW.day.L3C.SWE.multi-sensor.multi-platform.MERGED.4-0.r1']
        self.assertEqual(audit.audit_layer(layer('snow.swe', None), ids)['status'], 'missing-version')
        self.assertEqual(audit.audit_layer(layer('future.new_layer'), ids)['status'], 'unmapped')
        self.assertEqual(audit.audit_layer(layer('soil_moisture.Anomaly'), ids)['status'], 'unmapped')

    def test_entire_layer_inventory_has_explicit_handling(self):
        layers = audit.validate_layers(json.loads(audit.DEFAULT_LAYERS.read_text()))
        for item in layers:
            with self.subTest(layer=item['id']):
                self.assertIn(item['id'].lower(), set(audit.FAMILIES) | set(audit.UNRESOLVED))


class CatalogueTests(unittest.TestCase):
    def test_live_xml_discovery(self):
        xml = b'''<OpenSearchDescription xmlns:p="http://a9.com/-/spec/opensearch/extensions/parameters/1.0/">
        <Url><p:Parameter name="drsId"><p:Option value="esacci.TEST.1"/>
        <p:Option value="esacci.TEST.2"/></p:Parameter></Url></OpenSearchDescription>'''
        with patch.object(audit, 'urlopen') as opener:
            opener.return_value.__enter__.return_value.read.return_value = xml
            self.assertEqual(audit.fetch_live_ids(5), ['esacci.TEST.1', 'esacci.TEST.2'])

    def test_live_refresh_uses_new_ids_excludes_stale_index(self):
        import types
        fake_core = types.ModuleType('esa_climate_toolbox.core')
        fake_core.list_datasets = lambda store: ['esacci.OLD.1', 'esacci.COMMON.1']
        args = argparse.Namespace(catalogue=None, offline=False, timeout=5)
        with patch.dict('sys.modules', {'esa_climate_toolbox.core': fake_core}):
            with patch.object(audit, 'fetch_live_ids', return_value=['esacci.COMMON.1', 'esacci.NEW.1']):
                result = audit.load_catalogue(args)
        self.assertTrue(result['checked_live'])
        self.assertEqual(result['live_only_ids'], ['esacci.NEW.1'])
        self.assertEqual(result['index_only_ids'], ['esacci.OLD.1'])
        self.assertNotIn('esacci.OLD.1', result['ids'])
        self.assertEqual(result['ceda_ids'], ['esacci.COMMON.1', 'esacci.NEW.1'])
        self.assertEqual(result['toolbox_ids'], ['esacci.COMMON.1', 'esacci.OLD.1'])

    def test_invalid_catalogue_and_duplicate_layers(self):
        for ids in [[], ['not-a-drs-id'], None, 'esacci.TEST.1']:
            with self.subTest(ids=ids), self.assertRaises(ValueError):
                audit.validate_ids(ids)
        with self.assertRaises(ValueError):
            audit.validate_layers([layer('duplicate'), layer('DUPLICATE')])


class CliTests(unittest.TestCase):
    def test_json_snapshot_round_trip_and_source_driven_scope(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            layers = root / 'layers.json'
            snapshot = root / 'catalogue.json'
            output = root / 'audit.json'
            layers.write_text(json.dumps([layer('snow.swe', '2.0'), layer('future.new_layer')]))
            snapshot.write_text(json.dumps({'ids': [
                'esacci.SNOW.day.L3C.SWE.multi-sensor.multi-platform.MERGED.4-0.r1'
            ]}))
            with contextlib.redirect_stderr(io.StringIO()):
                code = audit.main(['--layers', str(layers), '--catalogue', str(snapshot),
                                   '--format', 'json', '--output', str(output)])
            self.assertEqual(code, 0)
            report = json.loads(output.read_text())
            self.assertEqual(len(report['layers']), 2)
            self.assertFalse(report['catalogue']['checked_live'])
            args = argparse.Namespace(catalogue=output)
            self.assertEqual(audit.load_catalogue(args)['ids'], report['catalogue']['ids'])
            markdown = audit.render_markdown(report)
            self.assertIn('Blocked — do not update (1)', markdown)
            self.assertFalse(report['layers'][0]['update_eligible'])
            self.assertIn('future.new_layer', markdown)

    def test_input_files_cannot_be_overwritten(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'layers.json'
            original = json.dumps([layer('snow.swe')])
            path.write_text(original)
            with contextlib.redirect_stderr(io.StringIO()):
                self.assertEqual(audit.main(['--layers', str(path), '--output', str(path)]), 1)
            self.assertEqual(path.read_text(), original)

    def test_live_failure_returns_error_not_stale_report(self):
        with patch.object(audit, 'load_catalogue', side_effect=OSError('HTTP 429')):
            with contextlib.redirect_stderr(io.StringIO()), contextlib.redirect_stdout(io.StringIO()) as output:
                self.assertEqual(audit.main([]), 1)
        self.assertEqual(output.getvalue(), '')

    def test_markdown_escapes_table_cells(self):
        self.assertEqual(audit.markdown_cell('a|b\nc'), 'a\\|b c')


class AgreementTests(unittest.TestCase):
    BASE = 'esacci.SNOW.day.L3C.SWE.multi-sensor.multi-platform.MERGED.2-0.r1'
    OLD = 'esacci.SNOW.day.L3C.SWE.multi-sensor.multi-platform.MERGED.3-1.r1'
    NEW = 'esacci.SNOW.day.L3C.SWE.multi-sensor.multi-platform.MERGED.4-0.r1'

    def report(self, ceda=None, toolbox=None, live=True):
        return audit.build_report([layer('snow.swe', '2.0')],
                                  dual_catalogue(ceda or [self.BASE, self.NEW], toolbox, live), 'layers.json')

    def test_agreement_alone_is_not_update_eligibility(self):
        row = self.report()['layers'][0]
        self.assertEqual(row['status'], 'unverified')
        self.assertEqual(row['verification']['status'], 'pending')
        self.assertFalse(row['update_eligible'])
        self.assertIsNone(row['target_version'])

    def test_live_metadata_pass_is_required(self):
        report = self.report()
        audit.verify_updates(report, 5, checker=verified_check, timestamp_fetcher=sample_timestamps)
        row = report['layers'][0]
        self.assertEqual(row['status'], 'update-ready')
        self.assertTrue(row['update_eligible'])
        self.assertEqual(row['target_version'], '4.0')
        self.assertEqual(report['summary'], {'update-ready': 1})

    def test_latest_difference_blocks_even_with_older_common_version(self):
        report = self.report([self.OLD, self.NEW], [self.OLD])
        with patch.object(audit, 'verify_candidate') as checker:
            audit.verify_updates(report, 5)
        checker.assert_not_called()
        row = report['layers'][0]
        self.assertEqual(row['status'], 'source-version-mismatch')
        self.assertEqual(row['latest_ceda_version'], '4.0')
        self.assertEqual(row['latest_toolbox_version'], '3.1')
        self.assertIsNone(row['target_version'])
        self.assertFalse(row['update_eligible'])
        self.assertEqual(row['candidate_ids'], [])

    def test_toolbox_newer_than_ceda_is_also_blocked(self):
        row = self.report([self.OLD], [self.NEW])['layers'][0]
        self.assertEqual(row['status'], 'source-version-mismatch')

    def test_matching_versions_different_regions_are_blocked(self):
        nh = 'esacci.SEAICE.day.L4.SICONC.multi-sensor.multi-platform.AMSR_25kmEASE2.2-1.NH'
        sh = nh[:-2] + 'SH'
        report = audit.build_report([layer('sea_ice.ice_conc', '1.0')], dual_catalogue([nh, sh], [nh]), 'layers.json')
        self.assertEqual(report['layers'][0]['status'], 'source-product-mismatch')

    def test_one_source_missing_is_blocked(self):
        report = self.report(toolbox=['esacci.OTHER.1'])
        self.assertEqual(report['layers'][0]['status'], 'source-unavailable')

    def test_offline_snapshot_never_authorizes_updates(self):
        report = self.report(live=False)
        with patch.object(audit, 'verify_candidate') as checker:
            audit.verify_updates(report, 5)
        checker.assert_not_called()
        row = report['layers'][0]
        self.assertEqual(row['status'], 'unverified')
        self.assertEqual(row['verification']['status'], 'skipped')
        self.assertFalse(row['update_eligible'])

    def test_legacy_snapshot_does_not_assume_two_sources(self):
        report = audit.build_report([layer('snow.swe', '2.0')], {
            'ids': [self.NEW], 'source': 'legacy', 'checked_live': False, 'warnings': [],
        }, 'layers.json')
        self.assertEqual(report['layers'][0]['status'], 'unverified')
        self.assertIsNone(report['layers'][0]['latest_toolbox_version'])

    def test_replaying_a_verified_report_resets_update_eligibility(self):
        report = self.report()
        audit.verify_updates(report, 5, checker=verified_check, timestamp_fetcher=sample_timestamps)
        self.assertTrue(report['layers'][0]['update_eligible'])
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'verified.json'
            path.write_text(json.dumps(report))
            catalogue = audit.load_catalogue(argparse.Namespace(catalogue=path))
            replay = audit.build_report([layer('snow.swe', '2.0')], catalogue, 'layers.json')
            with patch.object(audit, 'verify_candidate') as checker:
                audit.verify_updates(replay, 5)
            checker.assert_not_called()
            self.assertFalse(replay['layers'][0]['update_eligible'])
            self.assertIsNone(replay['layers'][0]['target_version'])

    def test_toolbox_metadata_subprocess_has_a_hard_timeout(self):
        with patch.object(audit.subprocess, 'run', side_effect=subprocess.TimeoutExpired('metadata', 5)) as run:
            with self.assertRaises(subprocess.TimeoutExpired):
                audit.fetch_toolbox_metadata(self.NEW, 5)
        self.assertEqual(run.call_args.kwargs['timeout'], 5)
        self.assertTrue(run.call_args.kwargs['check'])

    def test_metadata_failure_timeout_or_missing_evidence_is_unverified(self):
        errors = [OSError('HTTP 503'), subprocess.TimeoutExpired('metadata', 5),
                  ValueError('missing product_version')]
        for error in errors:
            with self.subTest(error=error):
                report = self.report()
                with patch.object(audit, 'verify_candidate', side_effect=error):
                    audit.verify_updates(report, 5)
                row = report['layers'][0]
                self.assertEqual(row['status'], 'unverified')
                self.assertFalse(row['update_eligible'])
                self.assertIsNone(row['target_version'])

    def test_contradictory_metadata_is_explicitly_blocked(self):
        report = self.report()
        with patch.object(audit, 'verify_candidate', side_effect=audit.MetadataMismatch('wrong release')):
            audit.verify_updates(report, 5)
        self.assertEqual(report['layers'][0]['status'], 'metadata-mismatch')

    def test_every_latest_variant_must_verify(self):
        nh = 'esacci.SEAICE.day.L4.SICONC.multi-sensor.multi-platform.AMSR_25kmEASE2.2-1.NH'
        sh = nh[:-2] + 'SH'
        report = audit.build_report([layer('sea_ice.ice_conc', '1.0')], dual_catalogue([nh, sh]), 'layers.json')
        def checker(data_id, timeout):
            if data_id == sh:
                raise OSError('Unavailable SH metadata')
            return verified_check(data_id, timeout)
        audit.verify_updates(report, 5, checker=checker)
        self.assertFalse(report['layers'][0]['update_eligible'])
        self.assertEqual(report['layers'][0]['status'], 'unverified')

    def test_rate_limit_stops_further_metadata_requests(self):
        permafrost = 'esacci.PERMAFROST.yr.L4.PFR.multi-sensor.multi-platform.MODISLST_CRYOGRID.05-0.NH'
        report = audit.build_report([layer('snow.swe', '2.0'), layer('permafrost.PFR', '4.0')],
                                   dual_catalogue([self.NEW, permafrost]), 'layers.json')
        error = HTTPError('url', 429, 'Too Many Requests', {}, None)
        with patch.object(audit, 'verify_candidate', side_effect=error) as checker:
            audit.verify_updates(report, 5)
        error.close()
        self.assertEqual(checker.call_count, 1)
        self.assertTrue(all(not row['update_eligible'] for row in report['layers']))
        self.assertEqual(report['layers'][1]['verification']['status'], 'skipped')

    def test_verify_exact_metadata_product_version_and_identity(self):
        ceda = {'id': self.NEW, 'version': '4-0', 'uuid': 'same-record', 'url': 'https://example/metadata'}
        descriptor = {'data_id': self.NEW, 'attrs': {'product_version': 'v04-0', 'uuid': 'same-record'}}
        with patch.object(audit, 'fetch_ceda_metadata', return_value=ceda):
            with patch.object(audit, 'fetch_toolbox_metadata', return_value=descriptor):
                self.assertTrue(audit.verify_candidate(self.NEW, 5)['verified'])
                descriptor['attrs']['product_version'] = '3.1'
                with self.assertRaises(audit.MetadataMismatch):
                    audit.verify_candidate(self.NEW, 5)
                descriptor['attrs']['product_version'] = '4.0'
                descriptor['attrs']['uuid'] = 'different-record'
                with self.assertRaises(audit.MetadataMismatch):
                    audit.verify_candidate(self.NEW, 5)
                descriptor['data_id'] = self.OLD
                with self.assertRaises(audit.MetadataMismatch):
                    audit.verify_candidate(self.NEW, 5)

    def test_missing_toolbox_version_is_not_accepted(self):
        ceda = {'version': '4-0', 'uuid': 'record', 'url': 'url'}
        with patch.object(audit, 'fetch_ceda_metadata', return_value=ceda):
            with patch.object(audit, 'fetch_toolbox_metadata', return_value={'data_id': self.NEW, 'attrs': {}}):
                with self.assertRaises(ValueError):
                    audit.verify_candidate(self.NEW, 5)

    def test_ceda_metadata_must_contain_exact_aggregation(self):
        payload = {'features': [{'properties': {'identifier': 'record', 'aggregations': [{'id': self.OLD}]}}]}
        with patch.object(audit, 'urlopen') as opener:
            opener.return_value.__enter__.return_value.read.return_value = json.dumps(payload)
            with self.assertRaises(audit.MetadataMismatch):
                audit.fetch_ceda_metadata(self.NEW, 5)
            payload['features'][0]['properties']['aggregations'][0]['id'] = self.NEW
            opener.return_value.__enter__.return_value.read.return_value = json.dumps(payload)
            self.assertEqual(audit.fetch_ceda_metadata(self.NEW, 5)['uuid'], 'record')


class TimestampTests(unittest.TestCase):
    OLD = 'esacci.SNOW.day.L3C.SWE.multi-sensor.multi-platform.MERGED.2-0.r1'
    NEW = 'esacci.SNOW.day.L3C.SWE.multi-sensor.multi-platform.MERGED.4-0.r1'

    def run_comparison(self, old, new):
        report = audit.build_report([layer('snow.swe', '2.0')], dual_catalogue([self.OLD, self.NEW]), 'layers.json')
        def fetch(data_id, timeout):
            return [date + 'T00:00:00Z' for date in (old if data_id == self.OLD else new)]
        audit.verify_updates(report, 5, checker=verified_check, timestamp_fetcher=fetch)
        return report['layers'][0]

    def test_extension_preserves_all_old_timestamps(self):
        row = self.run_comparison(['2000-01-01', '2000-01-02'], ['2000-01-01', '2000-01-02', '2000-01-03'])
        self.assertTrue(row['update_eligible'])
        self.assertEqual(row['timestamp_comparison']['status'], 'preserved')
        self.assertEqual(row['timestamp_comparison']['added_count'], 1)
        self.assertEqual(audit.timestamp_summary(row), '2 -> 3; 0 missing')

    def test_fewer_timestamps_blocks_update(self):
        row = self.run_comparison(['2000-01-01', '2000-01-02'], ['2000-01-02'])
        self.assertEqual(row['status'], 'timestamp-regression')
        self.assertFalse(row['update_eligible'])
        self.assertIsNone(row['target_version'])
        self.assertEqual(row['timestamp_comparison']['variants'][0]['missing_periods'], ['2000-01-01'])

    def test_equal_counts_and_equal_endpoints_still_detect_gaps(self):
        row = self.run_comparison(['2000-01-01', '2000-01-02', '2000-01-04'],
                                  ['2000-01-01', '2000-01-03', '2000-01-04'])
        self.assertEqual(row['status'], 'timestamp-regression')
        self.assertEqual(row['timestamp_comparison']['missing_count'], 1)
        self.assertEqual(row['timestamp_comparison']['added_count'], 1)

    def test_more_timestamps_does_not_mask_lost_old_dates(self):
        row = self.run_comparison(['2000-01-01', '2000-01-02'],
                                  ['2000-01-01', '2000-01-03', '2000-01-04'])
        self.assertEqual(row['status'], 'timestamp-regression')

    def test_yearly_product_compares_calendar_years_not_label_conventions(self):
        old = 'esacci.PERMAFROST.yr.L4.PFR.multi-sensor.multi-platform.MODISLST_CRYOGRID.04-0.r1'
        new = 'esacci.PERMAFROST.yr.L4.PFR.multi-sensor.multi-platform.MODISLST_CRYOGRID.05-0.NH'
        report = audit.build_report([layer('permafrost.PFR', '4.0')], dual_catalogue([old, new]), 'layers.json')
        values = {old: ['2003-07-02T00:00:00Z', '2004-07-02T00:00:00Z'],
                  new: ['2003-01-01T00:00:00Z', '2004-01-01T00:00:00Z', '2005-01-01T00:00:00Z']}
        audit.verify_updates(report, 5, checker=verified_check, timestamp_fetcher=lambda data_id, timeout: values[data_id])
        row = report['layers'][0]
        self.assertTrue(row['update_eligible'])
        self.assertEqual(row['timestamp_comparison']['variants'][0]['added_periods'], ['2005'])

    def test_monthly_product_compares_calendar_months(self):
        self.assertEqual(audit.timestamp_periods(['2000-02-15T12:00:00Z'], 'mon'), {'2000-02'})

    def test_confirmed_lakes_alias_selects_the_202_timestamp_baseline(self):
        prefix = 'esacci.LAKES.day.L3S.LK_PRODUCTS.multi-sensor.multi-platform.MERGED.'
        old = prefix + 'v2-0-2.r1'
        new = prefix + 'v3-0-0.r1'
        report = audit.build_report([layer('lakes.lswt', 'v2.02')], dual_catalogue([old, new]), 'layers.json')
        fetched = []
        def fetch(data_id, timeout):
            fetched.append(data_id)
            return sample_timestamps(data_id, timeout)
        audit.verify_updates(report, 5, checker=verified_check, timestamp_fetcher=fetch)
        self.assertIn(old, fetched)
        self.assertTrue(report['layers'][0]['update_eligible'])

    def test_no_guessing_for_empty_duplicate_or_unknown_cadence(self):
        for values, cadence in [([], 'day'), (['2000-01-01T00:00:00Z'] * 2, 'day'),
                                (['invalid'], 'day'), (['2000-01-01'], 'day'),
                                (['2000-01-01T00:00:00Z'], 'satellite-orbit-frequency')]:
            with self.subTest(values=values, cadence=cadence), self.assertRaises(ValueError):
                audit.timestamp_periods(values, cadence)

    def test_missing_old_release_cannot_approve_candidate(self):
        report = audit.build_report([layer('snow.swe', '2.0')], dual_catalogue([self.NEW]), 'layers.json')
        audit.verify_updates(report, 5, checker=verified_check, timestamp_fetcher=sample_timestamps)
        row = report['layers'][0]
        self.assertEqual(row['status'], 'timestamp-unverified')
        self.assertEqual(row['verification']['status'], 'verified')
        self.assertFalse(row['update_eligible'])

    def test_timestamp_timeout_is_blocked(self):
        report = audit.build_report([layer('snow.swe', '2.0')], dual_catalogue([self.OLD, self.NEW]), 'layers.json')
        with patch.object(audit, 'fetch_toolbox_timestamps', side_effect=subprocess.TimeoutExpired('time coordinate', 5)):
            audit.verify_updates(report, 5, checker=verified_check)
        self.assertEqual(report['layers'][0]['status'], 'timestamp-unverified')

    def test_regions_cannot_mask_each_others_missing_timestamps(self):
        prefix = 'esacci.SEAICE.day.L4.SICONC.multi-sensor.multi-platform.AMSR_25kmEASE2.'
        ids = [prefix + version + '.' + region for version in ['1-0', '2-1'] for region in ['NH', 'SH']]
        report = audit.build_report([layer('sea_ice.ice_conc', '1.0')], dual_catalogue(ids), 'layers.json')
        values = {ids[0]: ['2000-01-01T00:00:00Z'], ids[1]: ['2000-01-02T00:00:00Z'],
                  ids[2]: ['2000-01-02T00:00:00Z'], ids[3]: ['2000-01-01T00:00:00Z']}
        audit.verify_updates(report, 5, checker=verified_check, timestamp_fetcher=lambda data_id, timeout: values[data_id])
        self.assertEqual(report['layers'][0]['status'], 'timestamp-regression')
        self.assertEqual(report['layers'][0]['timestamp_comparison']['missing_count'], 2)

    def test_every_mixed_current_release_needs_a_baseline(self):
        prefix = 'esacci.SEASTATE.mon.L4.SWH.multi-sensor.multi-platform.MULTI_1M.'
        report = audit.build_report([layer('sea_state.swh_mean', '1.1 + 3')],
                                   dual_catalogue([prefix + '3-0.r1', prefix + '4-0.r1']), 'layers.json')
        audit.verify_updates(report, 5, checker=verified_check, timestamp_fetcher=sample_timestamps)
        self.assertEqual(report['layers'][0]['status'], 'timestamp-unverified')

    def test_timestamp_worker_is_bounded_and_checks_identity(self):
        with patch.object(audit.subprocess, 'run') as run:
            run.return_value.stdout = json.dumps({'id': self.OLD, 'timestamps': ['2000-01-01T00:00:00Z']})
            with self.assertRaises(ValueError):
                audit.fetch_toolbox_timestamps(self.NEW, 5)
            self.assertEqual(run.call_args.kwargs['timeout'], 5)

    def test_subprocess_errors_do_not_dump_source_code_into_report(self):
        error = subprocess.CalledProcessError(1, ['python', '-c', 'LONG WORKER SOURCE'],
                                             stderr='Traceback\n  source code\nTypeError: incompatible library\n')
        message, limited = audit.provider_error(error)
        self.assertEqual(message, 'Toolbox request failed: TypeError: incompatible library')
        self.assertNotIn('LONG WORKER SOURCE', message)
        self.assertFalse(limited)


class FormattingTests(unittest.TestCase):
    def setUp(self):
        self.ids = [
            'esacci.SNOW.day.L3C.SWE.multi-sensor.multi-platform.MERGED.2-0.r1',
            'esacci.SNOW.day.L3C.SWE.multi-sensor.multi-platform.MERGED.4-0.r1',
            'esacci.FIRE.mon.L4.BA.MODIS.Terra.MODIS_TERRA.v5-1.grid',
            'esacci.SST.day.L4.SSTdepth.multi-sensor.multi-platform.OSTIA.2-1.sst',
            'esacci.OZONE.day.L3S.TC.multi-sensor.multi-platform.MERGED.fv0100.r1',
        ]
        layers = [layer('fire.burned_area', '5.1'), layer('snow.swe', '2.0'),
                  layer('sst.analysed_sst', '3.0'), layer('unknown.source'),
                  layer('ozone.total_ozone_column', '1')]
        for item, name in zip(layers, ['Fire', 'Snow', 'SST', 'Unknown Source', 'Ozone']):
            item['name'] = name
        self.report = audit.build_report(layers, dual_catalogue(self.ids), 'layers.json')
        audit.verify_updates(self.report, 5, checker=verified_check, timestamp_fetcher=sample_timestamps)

    def test_default_text_highlights_outdated_first(self):
        text = audit.render_text(self.report)
        self.assertIn('1 update-ready  |  0 blocked  |  1 up to date  |  2 need review  |  1 catalogue behind', text)
        outdated = text.index('UPDATE-READY — VERSIONS VERIFIED (1)')
        review = text.index('NEEDS MANUAL REVIEW (2)')
        behind = text.index('CATALOGUE BEHIND PROJECT (1)')
        current = text.index('UP TO DATE IN BOTH LISTINGS (1)')
        self.assertLess(outdated, review)
        self.assertLess(review, behind)
        self.assertLess(behind, current)
        self.assertRegex(text[outdated:review], r'Snow\s+2\.0\s+4\.0\s+4\.0')
        self.assertNotIn('SST', text[outdated:review])
        self.assertNotIn(self.ids[0], text)
        self.assertNotIn('\x1b[', text)

    def test_markdown_groups_layers_and_keeps_uncertainty(self):
        text = audit.render_markdown(self.report)
        self.assertLess(text.index('## Update-ready'), text.index('## Needs manual review'))
        self.assertIn('| Snow | snow.swe | 2.0 | 4.0 | 4.0 |', text)
        self.assertIn('Ambiguous version', text)
        self.assertIn('Source not mapped', text)
        self.assertIn('NOT confirmed up to date or outdated', text)
        self.assertNotIn(self.ids[0], text)

    def test_details_are_opt_in(self):
        for render in [audit.render_text, audit.render_markdown]:
            with self.subTest(render=render.__name__):
                text = render(self.report, details=True)
                self.assertIn(self.ids[0], text)
                self.assertIn('snow.swe', text)
                self.assertIn('Available versions:', text)

    def test_offline_warning_is_prominent(self):
        self.report['catalogue']['checked_live'] = False
        self.report['catalogue']['warnings'] = ['Offline snapshot; not a fresh check.']
        for render in [audit.render_text, audit.render_markdown]:
            with self.subTest(render=render.__name__):
                text = render(self.report)
                self.assertIn('may be stale', text)
                self.assertLess(text.index('Offline snapshot'), text.index('CEDA latest'))

    def test_zero_outdated_is_explicit(self):
        self.report['layers'] = [row for row in self.report['layers'] if row['status'] != 'update-ready']
        for render in [audit.render_text, audit.render_markdown]:
            with self.subTest(render=render.__name__):
                self.assertIn('No verified updates are eligible.', render(self.report))

    def test_text_table_wraps_long_values(self):
        text = '\n'.join(audit.text_table(['Dataset', 'Version'], [['Long name ' * 20, '1.0']]))
        self.assertLessEqual(max(map(len, text.splitlines())), 64)

    def test_cli_defaults_to_text_and_infers_markdown_file(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            layers_path = root / 'layers.json'
            snapshot = root / 'snapshot.json'
            markdown = root / 'audit.md'
            layers_path.write_text(json.dumps([layer('snow.swe', '2.0')]))
            snapshot.write_text(json.dumps({'ids': self.ids}))
            args = ['--layers', str(layers_path), '--catalogue', str(snapshot)]
            with contextlib.redirect_stdout(io.StringIO()) as output:
                self.assertEqual(audit.main(args), 0)
            self.assertTrue(output.getvalue().startswith('DATASET VERSION AUDIT\n'))
            with contextlib.redirect_stderr(io.StringIO()):
                self.assertEqual(audit.main(args + ['--output', str(markdown)]), 0)
            self.assertTrue(markdown.read_text().startswith('# Dataset version audit\n'))
            with contextlib.redirect_stderr(io.StringIO()):
                self.assertEqual(audit.main(args + ['--format', 'text', '--output', str(markdown)]), 0)
            self.assertTrue(markdown.read_text().startswith('DATASET VERSION AUDIT\n'))


if __name__ == '__main__':
    unittest.main()
