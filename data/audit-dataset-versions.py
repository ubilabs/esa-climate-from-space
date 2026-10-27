#!/usr/bin/env python3
"""Compare documented layer versions with matching ESA Toolbox product families.

Checks listings, candidate metadata and time coordinates; never changes layers
or loads climate-data variables.
Use --format json to retain catalogue IDs for a repeatable --catalogue audit.
"""

import argparse
from collections import Counter
from datetime import datetime, timezone
import importlib.metadata
import json
from pathlib import Path
import re
import subprocess
import sys
import textwrap
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET


DEFAULT_LAYERS = Path(__file__).resolve().parents[1] / 'storage/layers/layers-en.json'
CATALOGUE_URL = (
    'https://archive.opensearch.ceda.ac.uk/opensearch/description.xml'
    '?parentIdentifier=cci'
)
CEDA_REQUEST_URL = 'https://archive.opensearch.ceda.ac.uk/opensearch/request'
DOCUMENTATION_URL = (
    'https://esa-climate-toolbox.readthedocs.io/en/latest/notebooks/'
    'Accessing_Data/1-ECT_Finding_Data.html'
)
VERSION_FIELD = re.compile(
    r'^[ \t]*\*\*Version[ \t]*:?\*\*:?[^\S\r\n]*(\S[^\r\n]*?)[ \t]*$',
    re.I | re.M,
)


def family(prefix, suffix='r1'):
    """Pin product identity, but leave its version and intended variants open."""
    return re.compile(
        re.escape('esacci.' + prefix) + r'\.(?P<version>[^.]+)\.(?:' + suffix + ')'
    )


# Layer IDs alone do not identify sensors, algorithms or processing levels.
# These reviewed mappings intentionally do NOT match a whole ECV indiscriminately.
# No available/latest versions are hard-coded here.
FAMILIES = {
    'fire.burned_area': family('FIRE.mon.L4.BA.MODIS.Terra.MODIS_TERRA', 'grid'),
    'soil_moisture.sm': family(
        'SOILMOISTURE.day.L3S.SSMV.multi-sensor.multi-platform.COMBINED'
    ),
    'sst.analysed_sst': family('SST.day.L4.SSTdepth.multi-sensor.multi-platform.OSTIA', 'sst|r1'),
    'oc.chlor_a': family('OC.mon.L3S.CHLOR_A.multi-sensor.multi-platform.MERGED', 'geographic'),
    'aerosol.aod550_mean': family('AEROSOL.mon.L3C.AER_PRODUCTS.AATSR.Envisat.SU'),
    'cloud.cfc': family('CLOUD.mon.L3C.CLD_PRODUCTS.multi-sensor.multi-platform.AVHRR-PM'),
    'sea_level.sla': family('SEALEVEL.mon.L4.MSLA.multi-sensor.multi-platform.MERGED'),
    'sea_state.swh_mean': family('SEASTATE.mon.L4.SWH.multi-sensor.multi-platform.MULTI_1M'),
    'greenland_ice.sec': family('ICESHEETS.yr.Unspecified.SEC.multi-sensor.multi-platform.UNSPECIFIED'),
    'permafrost.pfr': family('PERMAFROST.yr.L4.PFR.multi-sensor.multi-platform.MODISLST_CRYOGRID', 'NH|r1'),
    'land_cover.lccs_class': family('LC.yr.L4.LCCS.multi-sensor.multi-platform.Map'),
    'sea_surface_salinity.sss': family(
        'SEASURFACESALINITY.15-days.L4.SSS.multi-sensor.multi-platform.'
        'GLOBAL-MERGED_OI_Monthly_CENTRED_15Day_0-25deg'
    ),
    'snow.swe': family('SNOW.day.L3C.SWE.multi-sensor.multi-platform.MERGED'),
    'biomass.agb': re.compile(
        r'esacci\.BIOMASS\.yr\.L4\.AGB\.multi-sensor\.multi-platform\.MERGED\.'
        r'(?P<version>[^.]+)\.(?:100m|r1)'
    ),
    'greenhouse.xco2': family('GHG.satellite-orbit-frequency.L2.CO2.OCO.OCO-2.FOCAL'),
    'greenhouse.xch4': family('GHG.satellite-orbit-frequency.L2.CH4.TROPOMI.Sentinel-5P.WFMD', 'r1|[0-9]{6}-[0-9]{6}'),
    'ozone.total_ozone_column': family('OZONE.day.L3S.TC.multi-sensor.multi-platform.MERGED'),
    'lakes.lswt': family('LAKES.day.L3S.LK_PRODUCTS.multi-sensor.multi-platform.MERGED'),
    'water_vapour.tcwv': family('WATERVAPOUR.mon.L3S.TCWV.multi-sensor.multi-platform.TCWV_land_005deg'),
    'land_surface_temperature.lst': family('LST.mon.L3C.LST.multi-sensor.multi-platform.SSMI_SSMIS', 'ASC'),
    'sea_ice.ice_conc': family('SEAICE.day.L4.SICONC.multi-sensor.multi-platform.AMSR_25kmEASE2', 'NH|SH'),
    'vegetation.lai': family('VEGETATION.5-days.L3S.VP_PRODUCTS.multi-sensor.multi-platform.MERGED', 'r1|sites|tiles'),
    'land_cover.class': re.compile(
        r'esacci\.LC\.5-yrs\.L4\.Map\.multi-sensor\.multi-platform\.HRLC30-A[0-9]+\.'
        r'(?P<version>[^.]+)\.(?:Africa|Amazonia|Siberia)'
    ),
    'river_discharge.water_level_anomaly': family('RD.satellite-orbit-frequency.L3S.WL.multi-sensor.multi-platform.MERGED'),
}

UNRESOLVED = {
    'soil_moisture.anomaly': 'No exact anomaly-product mapping; raw COMBINED soil moisture is not an anomaly product.',
    'ozone.ozone_profile': 'Source identity is ambiguous: the layer describes a TM5 profile but links total-column ozone. Identify the source first.',
    'glaciers.ice': 'RGI is not mapped to the primary ESA Toolbox store; check the glacier inventory provider separately.',
    'ice_sheets_antarctica.dm': 'No exact Antarctic GMB mapping in the primary store. Older Zarr representations and Greenland GMB are not replacements.',
}

NOTES = {
    'fire.burned_area': 'MODIS-only family. Harmonised mr_har and Sentinel-2 products are different families.',
    'sst.analysed_sst': 'Toolbox OSTIA listings may lag the EOCIS/CDR3 source used by this project; never recommend a downgrade.',
    'sea_state.swh_mean': 'For a mixed documented version (e.g. 1.1 + 3), compare against its highest component.',
    'greenland_ice.sec': 'CryoSat-2 SEC with different averaging windows is a separate family.',
    'permafrost.pfr': 'Northern Hemisphere MODIS fraction only; exclude Antarctic, ERA5 back-extension, ALT and GTD products.',
    'biomass.agb': 'Compare 100 m MERGED AGB maps, not CHANGE/DIFF maps or coarser grids. Legacy r1 entries require grid verification.',
    'greenhouse.xco2': 'FOCAL L2 source; the app aggregates it. Legacy OBS4MIPS download scripts describe a different product.',
    'greenhouse.xch4': 'TROPOMI/WFMD L2 source; the app aggregates it. Legacy OBS4MIPS download scripts describe a different product.',
    'ozone.total_ozone_column': 'Compact ozone version tokens such as fv0100 need manual interpretation; do not read them as version 100.',
    'lakes.lswt': 'The project owner confirmed that the documented v2.02 label means 2.0.2. The v3.0.0 source is available in esa-cci-zarr even when the primary esa-cci opener is unavailable.',
    'sea_ice.ice_conc': 'AMSR concentration at 25 km only; exclude RE_SSMI, other grids and sea-ice thickness.',
    'vegetation.lai': 'New releases may use sites/tiles with different coverage. Verify LAI schema and coverage before migrating.',
    'river_discharge.water_level_anomaly': 'Compare source WL releases; the displayed anomaly is derived by the project.',
}


def version_key(value):
    """Conservative numeric comparison; keep opaque/compact tokens unresolved."""
    value = re.sub(r'^(?:fv|v)', '', value.strip(), flags=re.I)
    if not re.fullmatch(r'\d+(?:[.-]\d+)*', value):
        return None
    # fv0100/fv0002 are compact codes, not ordinary integer versions.
    if value.startswith('0') and len(value) > 1 and not re.search(r'[.-]', value):
        return None
    parts = tuple(int(part) for part in re.split(r'[.-]', value))
    while len(parts) > 1 and parts[-1] == 0:
        parts = parts[:-1]
    return parts


def display_version(value):
    if version_key(value) is None:
        return value
    numeric = re.sub(r'^(?:fv|v)', '', value, flags=re.I)
    return '.'.join(str(int(part)) for part in re.split(r'[.-]', numeric))


def documented_version(description):
    match = VERSION_FIELD.search(description)
    return match.group(1).strip() if match else None


def project_release(layer_id, label):
    # Explicit project-owner confirmation, not a general decimal-version rule.
    if layer_id.lower() == 'lakes.lswt' and label and label.lower().removeprefix('v') == '2.02':
        return '2.0.2'
    return label


def validate_layers(value):
    if not isinstance(value, list):
        raise ValueError('Layer source must be a JSON array.')
    seen = set()
    for layer in value:
        if not isinstance(layer, dict) or not isinstance(layer.get('id'), str) or not layer['id'].strip():
            raise ValueError('Every layer must have a non-empty string id.')
        key = layer['id'].lower()
        if key in seen:
            raise ValueError(f'Duplicate layer ID: {layer["id"]}')
        if not isinstance(layer.get('description', ''), str):
            raise ValueError(f'Invalid description for {layer["id"]}')
        seen.add(key)
    return value


def validate_ids(ids):
    if not isinstance(ids, list) or not ids or not all(isinstance(item, str) and item.startswith('esacci.') for item in ids):
        raise ValueError('Catalogue must contain a non-empty list of esacci.* IDs.')
    return sorted(set(ids))


def fetch_live_ids(timeout):
    request = Request(CATALOGUE_URL, headers={'User-Agent': 'esa-climate-from-space/version-audit'})
    with urlopen(request, timeout=timeout) as response:
        root = ET.fromstring(response.read())
    namespace = '{http://a9.com/-/spec/opensearch/extensions/parameters/1.0/}'
    ids = [
        option.attrib['value']
        for parameter in root.iter(namespace + 'Parameter')
        if parameter.get('name') == 'drsId'
        for option in parameter.findall(namespace + 'Option')
        if 'value' in option.attrib
    ]
    return validate_ids(ids)


def load_catalogue(args):
    if args.catalogue:
        snapshot = json.loads(args.catalogue.read_text(encoding='utf-8'))
        if not isinstance(snapshot, dict):
            raise ValueError('Snapshot must be an audit JSON object or an object with an ids array.')
        catalogue = snapshot.get('catalogue', snapshot)
        if not isinstance(catalogue, dict):
            raise ValueError('Invalid catalogue snapshot.')
        return {
            'ids': validate_ids(catalogue.get('ids')),
            'ceda_ids': validate_ids(catalogue['ceda_ids']) if catalogue.get('ceda_ids') else None,
            'toolbox_ids': validate_ids(catalogue['toolbox_ids']) if catalogue.get('toolbox_ids') else None,
            'source': f'snapshot: {args.catalogue}',
            'checked_live': False,
            'warnings': ['Offline snapshot; update eligibility requires a fresh two-source metadata check.'],
        }

    # One discovery call rather than describe_data/open_data calls per layer.
    from esa_climate_toolbox.core import list_datasets

    indexed = validate_ids(list(list_datasets('esa-cci')))
    catalogue = {
        'ids': indexed,
        'toolbox_ids': indexed,
        'ceda_ids': None,
        'source': 'ESA Toolbox esa-cci discovery index',
        'checked_live': False,
        'warnings': [],
    }
    if args.offline:
        catalogue['warnings'].append('Using the packaged Toolbox index only; it can lag the live catalogue.')
        return catalogue

    # The connector's list_datasets() index is packaged. Refresh with one live
    # discovery request, avoiding CEDA's rate limits on per-product metadata.
    # Fail explicitly on network errors; never silently label a stale index live.
    live = fetch_live_ids(args.timeout)
    catalogue.update(ids=live, ceda_ids=live, source=CATALOGUE_URL, checked_live=True)
    catalogue['live_only_ids'] = sorted(set(live) - set(indexed))
    catalogue['index_only_ids'] = sorted(set(indexed) - set(live))
    if catalogue['live_only_ids'] or catalogue['index_only_ids']:
        catalogue['warnings'].append(
            'Live catalogue differs from the installed Toolbox index. Live-only IDs '
            'cannot be recommended unless the latest matching versions and product IDs agree in both sources.'
        )
    return catalogue


def audit_layer(layer, ids):
    layer_id = layer['id']
    key = layer_id.lower()
    current = documented_version(layer.get('description', ''))
    result = {
        'id': layer_id,
        'name': layer.get('name', layer_id),
        'project_version': current,
        'available_versions': [],
        'latest_listed_version': None,
        'status': 'unmapped',
        'matches': [],
        'notes': [],
    }
    if key not in FAMILIES:
        result['notes'].append(UNRESOLVED.get(
            key, 'No reviewed product-family mapping for this layer. Add one before comparing releases.'
        ))
        return result
    if key in NOTES:
        result['notes'].append(NOTES[key])
    for data_id in ids:
        match = FAMILIES[key].fullmatch(data_id)
        if match:
            result['matches'].append({'id': data_id, 'version': match.group('version')})
    versions = {match['version'] for match in result['matches']}
    ordered = sorted(versions, key=lambda value: (version_key(value) is not None, version_key(value) or (), value))
    result['available_versions'] = list(dict.fromkeys(display_version(value) for value in ordered))
    if not versions:
        result['status'] = 'not-listed'
        result['notes'].append('No matching entry in the selected primary catalogue; this does not prove the product is unavailable elsewhere.')
        return result
    if any(version_key(value) is None for value in versions):
        result['status'] = 'review-needed'
        result['notes'].append('Opaque catalogue version token(s); cannot safely rank releases automatically.')
        return result
    latest = max(versions, key=lambda value: (version_key(value), value))
    result['latest_listed_version'] = display_version(latest)
    if not current:
        result['status'] = 'missing-version'
        return result
    components = [version_key(part) for part in project_release(layer_id, current).split('+')]
    if any(part is None for part in components):
        result['status'] = 'review-needed'
        result['notes'].append('Documented version is not safely comparable as a numeric release.')
        return result
    baseline = max(components)
    latest_key = version_key(latest)
    result['status'] = (
        'newer-listed' if latest_key > baseline else
        'catalogue-behind' if latest_key < baseline else
        'up-to-date'
    )
    if key == 'biomass.agb' and current == '5.01':
        result['notes'].append('The catalogue calls the 5.x family 5-0; patch-level equivalence to project 5.01 is not verified.')
    if result['status'] == 'catalogue-behind':
        result['notes'].append('The documented project version is newer than the matching listing; check the provider directly, not a downgrade.')
    return result


def audit_sources(layer, catalogue):
    """Fail closed: an older common version is never an automatic fallback."""
    ceda = audit_layer(layer, catalogue.get('ceda_ids') or catalogue['ids'])
    toolbox = audit_layer(layer, catalogue.get('toolbox_ids') or [])
    result = dict(ceda)
    result.update(
        latest_ceda_version=ceda['latest_listed_version'] if catalogue.get('ceda_ids') else None,
        latest_toolbox_version=toolbox['latest_listed_version'],
        ceda_versions=ceda['available_versions'] if catalogue.get('ceda_ids') else [],
        toolbox_versions=toolbox['available_versions'],
        toolbox_matches=toolbox['matches'],
        update_eligible=False,
        target_version=None,
        candidate_ids=[],
        verification={'status': 'not-required', 'checks': []},
        timestamp_comparison={'status': 'not-checked', 'variants': []},
    )
    # The legacy single-source field is an agreed version, never a CEDA-only target.
    result['latest_listed_version'] = None
    if ceda['status'] == 'unmapped':
        return result
    if not catalogue.get('ceda_ids') or not catalogue.get('toolbox_ids'):
        result['status'] = 'unverified'
        result['verification'].update(status='skipped', reason='Separate CEDA and Toolbox listings are not both available.')
        return result
    if not ceda['matches'] or not toolbox['matches']:
        result['status'] = 'source-unavailable'
        return result
    ceda_latest = result['latest_ceda_version']
    toolbox_latest = result['latest_toolbox_version']
    if ceda_latest is None or toolbox_latest is None:
        result['status'] = 'review-needed'
        return result
    if version_key(ceda_latest) != version_key(toolbox_latest):
        result['status'] = 'source-version-mismatch'
        result['notes'].append('Latest CEDA and Toolbox versions differ. An older common version is not selected as a fallback.')
        return result
    ceda_ids = {item['id'] for item in ceda['matches'] if version_key(item['version']) == version_key(ceda_latest)}
    toolbox_ids = {item['id'] for item in toolbox['matches'] if version_key(item['version']) == version_key(toolbox_latest)}
    if ceda_ids != toolbox_ids:
        result['status'] = 'source-product-mismatch'
        result['notes'].append('Version numbers agree, but the latest product IDs/regions/variants differ between sources.')
        return result
    result['latest_listed_version'] = ceda_latest
    if ceda['status'] == 'newer-listed':
        result['status'] = 'unverified'
        result['candidate_ids'] = sorted(ceda_ids)
        result['verification']['status'] = 'pending'
    return result


class MetadataMismatch(ValueError):
    """A metadata response contradicts the selected product/version."""


def fetch_ceda_metadata(data_id, timeout):
    url = CEDA_REQUEST_URL + '?' + urlencode({
        'parentIdentifier': 'cci', 'drsId': data_id, 'httpAccept': 'application/geo+json',
    })
    request = Request(url, headers={'User-Agent': 'esa-climate-from-space/version-audit'})
    with urlopen(request, timeout=timeout) as response:
        payload = json.load(response)
    matches = []
    for feature in payload.get('features', []):
        properties = feature.get('properties', {})
        if any(item.get('id') == data_id for item in properties.get('aggregations', [])):
            matches.append(properties)
    if len(matches) != 1 or not matches[0].get('identifier'):
        raise MetadataMismatch('CEDA metadata does not uniquely identify the requested aggregation.')
    properties = matches[0]
    if properties.get('versionStatus') not in (None, 'current'):
        raise MetadataMismatch('CEDA metadata does not mark the selected catalogue record as current.')
    return {
        'id': data_id, 'version': data_id.split('.')[8],
        'uuid': properties['identifier'], 'url': url,
        'title': properties.get('title'),
    }


def fetch_toolbox_metadata(data_id, timeout):
    # The connector has its own retry/timeouts (some releases retry 200 times).
    # Bound the entire operation in a child process; a timeout cannot hang the
    # audit or leave a background metadata thread making further requests.
    code = '''
import json
import sys
from xcube.core.store import new_data_store
store = new_data_store('esa-cci', num_retries=1)
print(json.dumps(store.describe_data(sys.argv[1]).to_dict(), default=str))
'''
    completed = subprocess.run(
        [sys.executable, '-c', code, data_id], capture_output=True, text=True,
        timeout=timeout, check=True,
    )
    return json.loads(completed.stdout)


def verify_candidate(data_id, timeout):
    """Confirm the exact CEDA aggregation and Toolbox metadata refer to one release."""
    ceda = fetch_ceda_metadata(data_id, timeout)
    toolbox = fetch_toolbox_metadata(data_id, timeout)
    attrs = toolbox.get('attrs', {})
    expected = version_key(data_id.split('.')[8])
    if toolbox.get('data_id') != data_id:
        raise MetadataMismatch('Toolbox metadata returned a different product ID.')
    version = attrs.get('product_version')
    if not isinstance(version, str) or version_key(version) is None:
        raise ValueError('Toolbox metadata has no unambiguous product_version.')
    if version_key(version) != expected or version_key(ceda['version']) != expected:
        raise MetadataMismatch('Metadata product versions do not match the selected release.')
    uuid = attrs.get('uuid')
    if not uuid:
        match = re.search(r'/uuid/([a-fA-F0-9]{32})(?:/|$)', attrs.get('catalog_url', ''))
        uuid = match.group(1) if match else None
    if not uuid:
        raise ValueError('Toolbox metadata has no catalogue identity to verify against CEDA.')
    if uuid != ceda['uuid']:
        raise MetadataMismatch('Toolbox and CEDA metadata refer to different catalogue records.')
    return {
        'id': data_id, 'ceda_version': ceda['version'], 'toolbox_version': version,
        'catalogue_uuid': uuid, 'ceda_metadata_url': ceda['url'], 'verified': True,
    }


def fetch_toolbox_timestamps(data_id, timeout):
    """Read the lazy dataset's time coordinate, never its climate-data variables."""
    code = '''
import json
import sys
import numpy as np
from xcube.core.store import new_data_store
store = new_data_store('esa-cci', num_retries=1)
dataset = store.open_data(sys.argv[1])
try:
    coordinate = dataset['time']
    if coordinate.ndim != 1 or not np.issubdtype(coordinate.dtype, np.datetime64):
        raise ValueError('Expected a one-dimensional decoded datetime64 time coordinate.')
    values = coordinate.values
    if not values.size or np.isnat(values).any():
        raise ValueError('The time coordinate is empty or contains missing dates.')
    timestamps = np.datetime_as_string(values, unit='ns', timezone='UTC').tolist()
    print(json.dumps({'id': sys.argv[1], 'timestamps': timestamps}))
finally:
    close = getattr(dataset, 'close', None)
    if close:
        close()
'''
    completed = subprocess.run(
        [sys.executable, '-c', code, data_id], capture_output=True, text=True,
        timeout=timeout, check=True,
    )
    payload = json.loads(completed.stdout)
    if payload.get('id') != data_id:
        raise ValueError('Time-coordinate response identifies a different dataset.')
    return payload.get('timestamps')


def timestamp_variant(data_id):
    parts = data_id.split('.')
    suffix = '.'.join(parts[9:])
    # This reviewed historical rename retains the same NH fraction product.
    if parts[1] == 'PERMAFROST' and parts[4] == 'PFR' and suffix == 'r1':
        suffix = 'NH'
    return '.'.join(parts[:8] + [suffix])


def timestamp_periods(values, frequency):
    if not isinstance(values, list) or not values:
        raise ValueError('A complete, non-empty timestamp list is required.')
    periods = set()
    for value in values:
        if not isinstance(value, str):
            raise ValueError('Timestamp values must be ISO 8601 strings.')
        parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
        if parsed.tzinfo is None:
            raise ValueError('Timestamp values must include their timezone.')
        parsed = parsed.astimezone(timezone.utc)
        if frequency == 'yr':
            period = parsed.strftime('%Y')
        elif frequency == 'mon':
            period = parsed.strftime('%Y-%m')
        elif frequency == 'day' or frequency.endswith('-days'):
            period = parsed.strftime('%Y-%m-%d')
        else:
            # Other cadences need an explicit policy, not a guessed aggregation.
            raise ValueError(f'No reviewed timestamp comparison policy for frequency {frequency}.')
        periods.add(period)
    if len(periods) != len(values):
        raise ValueError('Duplicate timestamps/periods make the coverage comparison ambiguous.')
    return periods


def compare_timestamps(row, catalogue, timeout, fetcher):
    """Require preservation of all old release periods, per mapped variant."""
    components = [version_key(part) for part in project_release(row['id'], row['project_version']).split('+')]
    available = set(catalogue.get('ceda_ids') or []) & set(catalogue.get('toolbox_ids') or [])
    baseline_ids = []
    pattern = FAMILIES[row['id'].lower()]
    for component in components:
        matches = [data_id for data_id in sorted(available)
                   if (match := pattern.fullmatch(data_id)) and version_key(match.group('version')) == component]
        if not matches:
            raise ValueError('The exact documented current release is not listed in both sources; timestamp baseline is unverified.')
        baseline_ids.extend(matches)
    old_by_variant = {}
    new_by_variant = {}
    for data_id in baseline_ids:
        old_by_variant.setdefault(timestamp_variant(data_id), []).append(data_id)
    for data_id in row['candidate_ids']:
        new_by_variant.setdefault(timestamp_variant(data_id), []).append(data_id)
    if set(old_by_variant) != set(new_by_variant):
        raise ValueError('Current and candidate regions/grids/variants cannot be paired safely for timestamp comparison.')
    comparison = {'status': 'preserved', 'variants': [], 'missing_count': 0, 'added_count': 0}
    for variant, new_ids in sorted(new_by_variant.items()):
        old_ids = old_by_variant[variant]
        frequency = new_ids[0].split('.')[2]
        old_periods = set()
        new_periods = set()
        for data_id in old_ids:
            old_periods.update(timestamp_periods(fetcher(data_id, timeout), frequency))
        for data_id in new_ids:
            new_periods.update(timestamp_periods(fetcher(data_id, timeout), frequency))
        missing = sorted(old_periods - new_periods)
        added = sorted(new_periods - old_periods)
        comparison['variants'].append({
            'variant': variant, 'frequency': frequency, 'baseline_ids': old_ids, 'candidate_ids': new_ids,
            'current_count': len(old_periods), 'candidate_count': len(new_periods),
            'current_start': min(old_periods), 'current_end': max(old_periods),
            'candidate_start': min(new_periods), 'candidate_end': max(new_periods),
            'missing_periods': missing, 'added_periods': added,
        })
        comparison['missing_count'] += len(missing)
        comparison['added_count'] += len(added)
    if comparison['missing_count']:
        comparison['status'] = 'regression'
    return comparison


def provider_error(error):
    """Keep subprocess source code/tracebacks out of the concise report."""
    stderr = (error.stderr or '') if isinstance(error, subprocess.CalledProcessError) else ''
    rate_limited = bool(re.search(r'\b429\b', str(error) + stderr))
    if isinstance(error, subprocess.CalledProcessError):
        lines = [line.strip() for line in stderr.splitlines() if line.strip()]
        message = 'Toolbox request failed: ' + (lines[-1] if lines else f'exit code {error.returncode}')
    elif isinstance(error, subprocess.TimeoutExpired):
        message = f'Toolbox request timed out after {error.timeout} seconds.'
    else:
        message = str(error)
    return message[:500], rate_limited


def verify_updates(report, timeout, checker=None, progress=False, timestamp_fetcher=None):
    checker = checker or verify_candidate
    timestamp_fetcher = timestamp_fetcher or fetch_toolbox_timestamps
    cache = {}
    time_cache = {}
    def cached_timestamps(data_id, limit):
        if data_id not in time_cache:
            time_cache[data_id] = timestamp_fetcher(data_id, limit)
        return time_cache[data_id]
    rate_limited = False
    for row in report['layers']:
        verification = row['verification']
        if verification['status'] != 'pending':
            continue
        if not report['catalogue']['checked_live']:
            verification.update(status='skipped', reason='Offline results cannot authorize an update; run a fresh live audit.')
            continue
        if rate_limited:
            verification.update(status='skipped', reason='Metadata checks stopped after rate limiting; retry the live audit later.')
            continue
        if progress:
            print(f'Verifying metadata: {row["id"]} → {row["latest_listed_version"]}', file=sys.stderr)
        try:
            # All regional/variant IDs in the latest release must pass, not just one.
            if not row['candidate_ids']:
                raise ValueError('No exact candidate IDs were selected for verification.')
            for data_id in row['candidate_ids']:
                if data_id not in cache:
                    cache[data_id] = checker(data_id, timeout)
                check = cache[data_id]
                if check.get('verified') is not True or check.get('id') != data_id:
                    raise ValueError('Metadata verifier did not confirm the exact candidate.')
                verification['checks'].append(check)
            verification['status'] = 'verified'
            if progress:
                print(f'Comparing timestamps: {row["id"]}', file=sys.stderr)
            row['timestamp_comparison'] = compare_timestamps(row, report['catalogue'], timeout, cached_timestamps)
            if row['timestamp_comparison']['status'] == 'regression':
                row['status'] = 'timestamp-regression'
                continue
        except Exception as error:
            # Per-candidate provider failures are audit findings, not reasons to
            # fall back to a common older release or report an update as approved.
            message, rate_limited = provider_error(error)
            if verification['status'] == 'verified':
                row['timestamp_comparison'].update(status='unverified', reason=message)
                row['status'] = 'timestamp-unverified'
            else:
                verification.update(status='failed', reason=message)
                row['status'] = 'metadata-mismatch' if isinstance(error, MetadataMismatch) else 'unverified'
            continue
        verification['status'] = 'verified'
        row.update(status='update-ready', update_eligible=True, target_version=row['latest_listed_version'])
    report['summary'] = dict(Counter(row['status'] for row in report['layers']))


def build_report(layers, catalogue, source):
    results = [audit_sources(layer, catalogue) for layer in layers]
    return {
        'schema_version': 3,
        'checked_at': datetime.now(timezone.utc).isoformat(),
        'layers_source': str(source),
        'scope': 'Matching product families in esa-cci only; not all upstream providers or secondary kerchunk/Zarr representations.',
        'update_policy': 'Latest CEDA/ODP and Toolbox versions and product IDs must agree; metadata must verify and all timestamp periods of the documented current release must be preserved per region/variant. No older common-version fallback.',
        'limitations': [
            'Project versions come from layer descriptions, not deployed data files.',
            'Timestamp coverage uses full source-release time coordinates, not deployed tile timestamps or just metadata start/end dates.',
            'A preserved Toolbox time axis does not prove valid observations at every timestamp/location; masks and per-pixel data quality are not checked.',
            'Update-ready confirms version/identity agreement and preserved timestamp periods, not bulk downloadability, spatial coverage, variable schemas or processing compatibility.',
            'Unknown layers and ambiguous source identities require a reviewed mapping; they are never silently skipped.',
        ],
        'catalogue': catalogue,
        'summary': dict(Counter(row['status'] for row in results)),
        'layers': results,
    }


def markdown_cell(value):
    return str(value if value is not None else '—').replace('|', '\\|').replace('\n', ' ')


SECTIONS = (
    ('Update-ready — versions verified', {'update-ready'},
     'A newer release has matching source versions, verified metadata and no missing baseline timestamp periods. Review processing compatibility before updating.'),
    ('Blocked — do not update', {'source-version-mismatch', 'source-product-mismatch', 'source-unavailable', 'metadata-mismatch', 'unverified', 'timestamp-regression', 'timestamp-unverified'},
     'No update is authorized: source agreement, metadata or timestamp preservation failed or could not be verified.'),
    ('Needs manual review', {'review-needed', 'missing-version', 'not-listed', 'unmapped'},
     'These datasets are NOT confirmed up to date or outdated; their source or version needs clarification.'),
    ('Catalogue behind project', {'catalogue-behind'},
     'The project documents a newer version than the Toolbox lists. Check the provider directly; do not downgrade.'),
    ('Up to date in both listings', {'up-to-date'},
     'The documented version matches the latest listed release in both sources. No update is needed.'),
)
REVIEW_LABELS = {
    'review-needed': 'Ambiguous version',
    'missing-version': 'No project version',
    'not-listed': 'Product not listed',
    'unmapped': 'Source not mapped',
}
BLOCKED_LABELS = {
    'source-version-mismatch': 'Latest versions differ',
    'source-product-mismatch': 'Product variants differ',
    'source-unavailable': 'Missing in one source',
    'metadata-mismatch': 'Metadata contradicts release',
    'unverified': 'Not verified',
    'timestamp-regression': 'Timestamp coverage reduced',
    'timestamp-unverified': 'Timestamps not verified',
}


def report_sections(report):
    for title, statuses, explanation in SECTIONS:
        rows = sorted(
            (row for row in report['layers'] if row['status'] in statuses),
            key=lambda row: (row.get('name') or row['id']).casefold(),
        )
        if rows or 'update-ready' in statuses:
            yield title, explanation, rows


def summary_line(report):
    counts = Counter(row['status'] for row in report['layers'])
    review_count = sum(counts[status] for status in REVIEW_LABELS)
    return (
        f'{counts["update-ready"]} update-ready  |  {sum(counts[status] for status in BLOCKED_LABELS)} blocked  |  '
        f'{counts["up-to-date"]} up to date  |  '
        f'{review_count} need review  |  {counts["catalogue-behind"]} catalogue behind'
    )


def finding(row):
    label = {**REVIEW_LABELS, **BLOCKED_LABELS}.get(row['status'], '')
    reason = row.get('verification', {}).get('reason')
    if row['status'] == 'timestamp-regression':
        return f'{label}: {row["timestamp_comparison"]["missing_count"]} missing period(s)'
    if row['status'] == 'timestamp-unverified':
        reason = row['timestamp_comparison'].get('reason')
    return f'{label}: {reason}' if row['status'] in {'unverified', 'timestamp-unverified'} and reason else label


def timestamp_summary(row):
    comparison = row['timestamp_comparison']
    if not comparison['variants']:
        return 'unverified' if comparison['status'] == 'unverified' else '—'
    current = sum(item['current_count'] for item in comparison['variants'])
    candidate = sum(item['candidate_count'] for item in comparison['variants'])
    return f'{current} -> {candidate}; {comparison["missing_count"]} missing'


def text_table(headers, rows):
    """Aligned plain text, without ANSI codes or a formatting dependency."""
    cells = [[str(cell) if cell is not None else '—' for cell in row] for row in rows]
    widths = [min(48, max([len(headers[i])] + [len(row[i]) for row in cells]))
              for i in range(len(headers))]
    lines = ['  ' + '  '.join(header.ljust(width) for header, width in zip(headers, widths)),
             '  ' + '  '.join('-' * width for width in widths)]
    for row in cells:
        wrapped = [textwrap.wrap(cell, width=width, break_long_words=True, break_on_hyphens=False) or ['']
                   for cell, width in zip(row, widths)]
        for line_index in range(max(map(len, wrapped))):
            lines.append('  ' + '  '.join(
                (parts[line_index] if line_index < len(parts) else '').ljust(width)
                for parts, width in zip(wrapped, widths)
            ).rstrip())
    return lines


def render_text(report, details=False):
    catalogue = report['catalogue']
    mode = 'LIVE catalogue' if catalogue['checked_live'] else 'OFFLINE catalogue — may be stale'
    lines = ['DATASET VERSION AUDIT', f'{len(report["layers"])} layers | {mode}',
             summary_line(report), '',
             'Project = version documented in the layer descriptions, not deployed data files.']
    for warning in catalogue['warnings']:
        lines.extend(textwrap.wrap('WARNING: ' + warning, width=100))
    for title, explanation, rows in report_sections(report):
        lines.extend(['', f'{title.upper()} ({len(rows)})'])
        if not rows:
            lines.append('  No verified updates are eligible. Check blocked and review results below.')
            continue
        lines.extend(textwrap.wrap(explanation, width=100))
        review = any(row['status'] in {**REVIEW_LABELS, **BLOCKED_LABELS} for row in rows)
        headers = ['Dataset', 'Project', 'CEDA latest', 'Toolbox latest', 'Time periods'] + (['Finding'] if review else [])
        values = [
            [row.get('name') or row['id'], row['project_version'], row['latest_ceda_version'], row['latest_toolbox_version'], timestamp_summary(row)]
            + ([finding(row)] if review else [])
            for row in rows
        ]
        lines.extend(text_table(headers, values))
    lines.extend(['', 'Only UPDATE-READY rows pass the version-agreement gate; all other updates are blocked.',
                  'An older common release is never substituted when the latest source versions differ.',
                  'Timestamp preservation does not approve spatial coverage, schemas or processing compatibility.',
                  'Scope: matching esa-cci product families, not every upstream provider.'])
    if details:
        lines.extend(['', 'DETAILS'])
        for _, _, rows in report_sections(report):
            for row in rows:
                lines.extend(['', f'{row["name"]} [{row["id"]}] ({row["status"]})',
                              '  Available versions: CEDA = ' + (', '.join(row['ceda_versions']) or 'not determined')
                              + '; Toolbox = ' + (', '.join(row['toolbox_versions']) or 'not determined')])
                lines.extend('  - ' + note for note in row['notes'])
                lines.extend('  CEDA: ' + match['id'] for match in row['matches'])
                lines.extend('  Toolbox: ' + match['id'] for match in row['toolbox_matches'])
                lines.append('  Verification: ' + json.dumps(row['verification'], ensure_ascii=False))
                lines.append('  Timestamp comparison: ' + json.dumps(row['timestamp_comparison'], ensure_ascii=False))
        lines.extend(['', f'Layer source: {report["layers_source"]}',
                      f'Catalogue: {catalogue["source"]} ({len(catalogue["ids"])} IDs)',
                      f'Checked: {report["checked_at"]}', f'Discovery workflow: {DOCUMENTATION_URL}'])
    else:
        lines.append('Use --details for layer IDs, available versions, source IDs and technical notes.')
    return '\n'.join(lines) + '\n'


def render_markdown(report, details=False):
    catalogue = report['catalogue']
    lines = ['# Dataset version audit', '', f'**{summary_line(report)}**', '',
             f'{len(report["layers"])} layers · {"Live catalogue" if catalogue["checked_live"] else "Offline catalogue — may be stale"}', '',
             '**Project version** means the version documented in the layer descriptions, not deployed data files.']
    for warning in catalogue['warnings']:
        lines.extend(['', f'> **Warning:** {warning}'])
    for title, explanation, rows in report_sections(report):
        lines.extend(['', f'## {title} ({len(rows)})', ''])
        if not rows:
            lines.append('No verified updates are eligible. Check blocked and review results below.')
            continue
        lines.extend([explanation, ''])
        review = any(row['status'] in {**REVIEW_LABELS, **BLOCKED_LABELS} for row in rows)
        headers = ['Dataset', 'Layer ID', 'Project version', 'CEDA latest', 'Toolbox latest', 'Time periods'] + (['Finding'] if review else [])
        lines.extend(['| ' + ' | '.join(headers) + ' |', '| ' + ' | '.join(['---'] * len(headers)) + ' |'])
        for row in rows:
            cells = [row.get('name') or row['id'], row['id'], row['project_version'], row['latest_ceda_version'], row['latest_toolbox_version'], timestamp_summary(row)]
            if review:
                cells.append(finding(row))
            lines.append('| ' + ' | '.join(markdown_cell(value) for value in cells) + ' |')
    if details:
        lines.extend(['', '## Matching IDs and notes', ''])
        for _, _, rows in report_sections(report):
            for row in rows:
                lines.extend([f'### {row["id"]}', '', f'Status: `{row["status"]}`',
                              'Available versions: CEDA = ' + (', '.join(row['ceda_versions']) or 'not determined')
                              + '; Toolbox = ' + (', '.join(row['toolbox_versions']) or 'not determined'), ''])
                lines.extend(f'- {note}' for note in row['notes'])
                lines.extend(f'- CEDA: `{match["id"]}` (raw version `{match["version"]}`)' for match in row['matches'])
                lines.extend(f'- Toolbox: `{match["id"]}` (raw version `{match["version"]}`)' for match in row['toolbox_matches'])
                lines.extend(['', 'Verification: `' + json.dumps(row['verification'], ensure_ascii=False) + '`'])
                lines.extend(['', 'Timestamp comparison: `' + json.dumps(row['timestamp_comparison'], ensure_ascii=False) + '`'])
                lines.append('')
    else:
        lines.extend(['', 'Use `--details` to include all available versions, source IDs and technical notes.'])
    lines.extend(['', '## Audit scope', '', f'Checked: {report["checked_at"]}',
                  f'Layer source: `{report["layers_source"]}`',
                  f'Catalogue: {catalogue["source"]} ({len(catalogue["ids"])} IDs)', '', report['scope'], '',
                  '**Update policy:** ' + report['update_policy'], ''])
    lines.extend(f'- {note}' for note in report['limitations'])
    lines.extend(['', f'Discovery workflow: {DOCUMENTATION_URL}', ''])
    return '\n'.join(lines)


def positive_timeout(value):
    timeout = float(value)
    if not 0 < timeout < float('inf'):
        raise argparse.ArgumentTypeError('Timeout must be a finite positive number.')
    return timeout


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--layers', type=Path, default=DEFAULT_LAYERS, help='Layer JSON source (default: storage/layers/layers-en.json, relative to this script).')
    parser.add_argument('--format', choices=['text', 'markdown', 'json'], help='Output format (default: text; inferred from .md/.markdown/.json output filenames).')
    parser.add_argument('--details', action='store_true', help='Include all versions, source IDs and technical notes in text/Markdown. JSON always includes them.')
    parser.add_argument('--output', type=Path, help='Write a report instead of printing to stdout.')
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--offline', action='store_true', help='Use only the packaged Toolbox index; do not verify the live catalogue.')
    mode.add_argument('--catalogue', type=Path, help='Replay an audit JSON snapshot (or {"ids": [...]}) without Toolbox/network access.')
    parser.add_argument('--timeout', type=positive_timeout, default=30, help='Timeout per CEDA request / Toolbox metadata subprocess, in seconds (default: 30).')
    args = parser.parse_args(argv)
    try:
        layers = validate_layers(json.loads(args.layers.read_text(encoding='utf-8')))
        # Never overwrite the layer source or an input snapshot with a report.
        inputs = [args.layers] + ([args.catalogue] if args.catalogue else [])
        if args.output and any(args.output.resolve() == path.resolve() for path in inputs):
            raise ValueError('Output must not overwrite an input file.')
        catalogue = load_catalogue(args)
        report = build_report(layers, catalogue, args.layers)
        verify_updates(report, args.timeout, progress=True)
        for package in ['esa-climate-toolbox', 'xcube-cci']:
            try:
                report.setdefault('package_versions', {})[package] = importlib.metadata.version(package)
            except importlib.metadata.PackageNotFoundError:
                pass
        output_format = args.format or {
            '.md': 'markdown', '.markdown': 'markdown', '.json': 'json',
        }.get(args.output.suffix.lower() if args.output else '', 'text')
        if output_format == 'json':
            text = json.dumps(report, indent=2, ensure_ascii=False) + '\n'
        elif output_format == 'markdown':
            text = render_markdown(report, details=args.details)
        else:
            text = render_text(report, details=args.details)
        if args.output:
            args.output.write_text(text, encoding='utf-8')
            print(f'Wrote {len(layers)} layer results to {args.output}', file=sys.stderr)
        else:
            print(text, end='')
    except (OSError, ValueError, ImportError, ET.ParseError) as error:
        print(f'Audit failed: {error}', file=sys.stderr)
        if isinstance(error, ImportError):
            print('Activate the ESA Toolbox environment, or use --catalogue with a saved JSON snapshot.', file=sys.stderr)
        elif not args.offline and not args.catalogue:
            print('No live result was assumed. Retry later, or explicitly use --offline for the packaged index.', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
