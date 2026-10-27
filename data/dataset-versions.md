# Dataset version audit

Checked: **20 October 2026** using ESA Climate Toolbox **1.7.2** and
`xcube-cci` **0.14.2**.

> This is a hand-reviewed discovery snapshot, not an update approval. The audit
> script now applies a stricter gate: latest CEDA/ODP and Toolbox versions and
> product IDs must agree, fresh metadata checks must pass, and current timestamp
> periods must be preserved. Run
> `python data/audit-dataset-versions.py`; only `update-ready` rows are eligible.

## Scope and verification

- Project inventory: all 28 layers in `storage/layers/layers-en.json`, with
  additional products/aliases in `data/layers-config.json` and `data/downloads/`.
- **Project version** below means the version documented in the English layer
  descriptions, not an inspection of deployed tiles or downloaded NetCDF files.
- Discovery follows the official [Finding Data notebook](https://esa-climate-toolbox.readthedocs.io/en/latest/notebooks/Accessing_Data/1-ECT_Finding_Data.html):
  `list_ecvs()`, `list_stores()`, `list_datasets()` and `list_ecv_datasets()`.
- Enumerated **826** entries in `esa-cci`, **209** in `esa-cci-kc`, and **45** in
  `esa-cci-zarr`; the local store was excluded.
- The `esa-cci` connector uses a packaged discovery index. Its 826 IDs were also
  checked against the [live CEDA OpenSearch description](https://archive.opensearch.ceda.ac.uk/opensearch/description.xml?parentIdentifier=cci):
  the live catalogue returned the same 826 IDs, with no additional IDs.
- Detailed `describe_data()` requests were rate-limited by CEDA (HTTP 429).
  Consequently this is a **version/discovery audit**, not confirmation that every
  product can currently be opened, or validation of every product's time range,
  variable schema, or suitability as a replacement. No bulk climate data were downloaded.
- “Latest” means latest **listed for the matching product in these Toolbox
  stores**, not necessarily latest published by every upstream provider.
- Versions from different sensors, retrieval algorithms, processing levels,
  resolutions, or variables must not be ranked as if they were one release series.

## Version comparison

The available-version column refers to matching `esa-cci` product families unless
another store is explicitly named. It does not list every alternative sensor
product for the entire ECV.

| Project layer / product | Project version | Available versions for matching product | Latest / interpretation |
| --- | --- | --- | --- |
| Aerosol optical depth, AATSR/SU (`aerosol.AOD550_mean`) | 4.3 | 4.3 | **4.3**; no newer AATSR/SU release listed. ADV, ORAC and ensemble products are different retrievals. |
| Above-ground biomass, MERGED (`biomass.agb`) | 5.01 | 2.0, 3.0, 4.0, 5.0, 6.0, 7.0 | **7.0**. Versions 5–7 have 100 m, 1 km, 10 km, 25 km and 50 km entries. The index labels the previous 5.x family `5-0`, whereas our script/docs specify the 5.01 patch. |
| Cloud fraction, AVHRR-PM (`cloud.cfc`) | 3.0 | 3.0 | **3.0**. Other sensor families have their own versions. |
| Fire burned area, MODIS Terra (`fire.burned_area`) | 5.1 | 5.1 | **5.1** for this exact product. A separate multi-sensor **`mr_har` 6.0.0** gridded BA product is listed; assess it separately rather than treating it as an automatic MODIS-only upgrade. |
| CO₂, OCO-2/FOCAL (`greenhouse.xco2`) | 11 | 10.1, 11 | **11**. Toolbox source is L2 satellite-orbit-frequency data, not the old monthly OBS4MIPS product in the legacy download script. |
| CH₄, TROPOMI/WFMD (`greenhouse.xch4`) | 1.8 | 1.8 | **1.8**; two catalogue entries, one explicitly named `201711-202406`. This is not the old OBS4MIPS product in the legacy script. |
| Greenland surface elevation change, merged (`greenland_ice.sec`) | 1.2 | 1.2 | **1.2** for the merged historical product. **CryoSat-2 SEC 2.2** is also listed in 2-year/5-year variants, but is a different sensor/time-window product. |
| Permafrost fraction, NH MODISLST_CRYOGRID (`permafrost.PFR`) | 4.0 | 3.0, 4.0, 5.0 | **5.0**. Northern Hemisphere and Antarctic products are separate; the ERA5 bias-corrected back-extension is also separate. |
| Global land-cover classes, LCCS 300 m (`land_cover.lccs_class`) | 2.0.7 | 2.0.7 | **2.0.7** (`2.0.7b` appears in kerchunk/Zarr names). PFT 2.0.81 is a different variable/product, not a newer LCCS class map. |
| High-resolution land-cover classes (`land_cover.class`) | 1.2 | 1.2 | **1.2** for HRLC10/HRLC30 regional maps in Africa, Amazonia and Siberia. Map and change products are separate. |
| Sea surface salinity, GLOBAL-MERGED centred 15-day (`sea_surface_salinity.sss`) | 5.5 | 4.41, 5.5 | **5.5**. Older non-GLOBAL `MERGED` entries also exist at 2.31/3.21; polar grids are separate products. |
| Snow water equivalent, MERGED (`snow.swe`) | 2.0 | 2.0, 3.1, 4.0 | **4.0**. Do not confuse SWE with snow-cover fraction, which has other release series. Zarr additionally lists historical SWE 1.0. |
| Soil moisture, COMBINED (`soil_moisture.sm`) | 9.1 | 5.2, 5.3, 6.1, 6.2, 7.1, 8.1, 9.1, 9.2 | **9.2**. ACTIVE and PASSIVE also reach 9.2, but are not the same product as COMBINED. |
| Soil-moisture anomalies (`soil_moisture.Anomaly`) | 8.1 | No matching anomaly product listed | **Not determined through the Toolbox.** Raw COMBINED 9.2 is available, but is not an anomaly product. `COMBINED_ADJUSTED` 7.1 is not evidence of an updated anomaly series. |
| Sea surface temperature, analysed OSTIA (`sst.analysed_sst`) | 3.0; script path 3.0.1 | OSTIA 1.1, 2.1; climatology 2.2 is separate | **Toolbox listing is behind our configured source.** Do not downgrade to 2.1. The EOCIS/CDR3 3.0.1 product in our script is not listed in these Toolbox stores. |
| Ocean colour, monthly CHLOR_A geographic (`oc.chlor_a`) | 6.0 | 6.0 | **6.0** for the exact monthly chlorophyll-a product. Kerchunk has some yearly IOP/K_490/RRS/OC_PRODUCTS 6.1 entries; those do not establish a monthly CHLOR_A 6.1 replacement. |
| Sea-level anomaly, monthly gridded MSLA (`sea_level.sla`) | 2.0 | 2.0 | **2.0** for MSLA. MSLTR 2.2/3.0 are trend/indicator products, not replacement anomaly grids. |
| Sea-state monthly significant wave height (`sea_state.swh_mean`) | 1.1 + 3.0 | 3.0, 4.0 | **4.0** for monthly L4 `MULTI_1M`. |
| Sea-ice concentration, AMSR 25 km, NH/SH (`sea_ice.ice_conc`) | 2.1 | 2.1 | **2.1** for AMSR 25 km. **RE_SSMI 12.5 km 3.0** is an alternative concentration product with different sensor/grid characteristics, not a drop-in version change. Thickness 4.0 is a different variable. |
| Land surface temperature, SSMI/SSMIS monthly ascending (`land_surface_temperature.lst`) | 2.33 | 2.33 | **2.33** for this microwave product. IRCDR 3.00 and daily infrared sensor products 4.00 are different products. |
| Total column water vapour, land 0.05° monthly (`water_vapour.tcwv`) | 3.2 | 3.2, 4.2 | **4.2**. Also available at 0.5° and daily frequency; keep the chosen grid/frequency consistent. |
| Vegetation LAI (`vegetation.lai`) | 1 | VP_PRODUCTS 1.0; 2.0 `sites`/`tiles` | **2.0 listed**, but as separate site/tile products. Check LAI variable availability and spatial coverage before replacing the v1 transect workflow. |
| River water-level anomalies (`river_discharge.water_level_anomaly`) | 1.1 | WL MERGED 1.1 | **1.1** for the source water-level product. The app's anomaly is a processed output, not a separately versioned Toolbox product. |
| Lake surface water temperature (`lakes.lswt`) | 2.02 | LK_PRODUCTS 1.0, 1.1, 2.0.2, 2.1.0, 3.0.0 | **3.0.0**. Subsequently confirmed by the project owner: `2.02` means `2.0.2`. The working Toolbox `esa-cci-zarr` representation retains all v2.0.2 calendar dates and adds 2021–2023; the primary `esa-cci` opener is currently unavailable. |
| Ozone total column (`ozone.total_ozone_column`) | 1 | TC `fv0100` | **`fv0100`** is the only total-column release token listed. Keep the raw version token rather than comparing it numerically to unrelated ozone profiles. Toolbox TC is daily L3S, whereas the app presents monthly data. |
| Ozone profile at 50° W (`ozone.ozone_profile`) | Not specified | Nadir profiles `fv0002`; limb profiles `v0001` in several sensor families | **No exact source match established.** The layer description links the same catalogue record as total-column ozone and calls the shown variable total ozone column despite the profile name. Identify the actual profile source before choosing an upgrade. |
| Antarctic gravimetric mass balance (`ice_sheets_antarctica.dm`) | 3.0 | Antarctic GMB 1.1 in `esa-cci-zarr`; no matching Antarctic GMB entry in `esa-cci` | **No current 3.x replacement identified through these stores.** Do not downgrade to the older Zarr 1.1 representation or substitute Greenland GMB 3.0. |
| Randolph Glacier Inventory (`glaciers.ice`) | RGI 5.0 | No matching glacier inventory listed | **Not determined through the Toolbox.** Check the glacier inventory provider separately. |

### Additional configured/download products

- **Lake chlorophyll-a** (`lakes.chla_mean`, `odp-ftp-lakes-chla_mean.sh`): the
  legacy script uses Lakes **1.0**; the shared `LK_PRODUCTS` family now lists
  **3.0.0**. Confirm the chlorophyll variable schema/coverage before migration.
- `lakes.lake_surface_water_temperature` is an older configured name for the lake
  temperature family; the same Lakes version comparison applies.
- `soil_moisture.sm_mean` is a configured soil-moisture alias, not a distinct
  versioned upstream product; compare the COMBINED family above.
- `sea_ice_nh.ice_conc` and `sea_ice_sh.ice_conc` are the separate hemisphere
  configurations represented by the sea-ice row above.
- `permafrost.pfr` in `data/layers-config.json` and `permafrost.PFR` in the English
  layer list refer to the permafrost-fraction family; the case difference is not
  a dataset release version.
- **OGVI** (`ogvi.ogvi`) occurs in `data/layers-config.json`, but has no matching
  active English layer or identifiable download source. No exact OGVI product
  was established from the Toolbox; do not equate it automatically with LAI.

## Exact discovery IDs

Unless stated otherwise, use store **`esa-cci`**. These are IDs returned by
discovery, not promises of identical schemas or successful downloads.

| Product | Latest matching / candidate ID |
| --- | --- |
| Aerosol AATSR/SU monthly | `esacci.AEROSOL.mon.L3C.AER_PRODUCTS.AATSR.Envisat.SU.4-3.r1` |
| Biomass AGB 100 m | `esacci.BIOMASS.yr.L4.AGB.multi-sensor.multi-platform.MERGED.7-0.100m` |
| Cloud AVHRR-PM | `esacci.CLOUD.mon.L3C.CLD_PRODUCTS.multi-sensor.multi-platform.AVHRR-PM.3-0.r1` |
| Fire MODIS grid | `esacci.FIRE.mon.L4.BA.MODIS.Terra.MODIS_TERRA.v5-1.grid` |
| Fire harmonised alternative | `esacci.FIRE.mon.L4.BA.multi-sensor.multi-platform.mr_har.v6-0-0.grid` |
| CO₂ OCO-2/FOCAL | `esacci.GHG.satellite-orbit-frequency.L2.CO2.OCO.OCO-2.FOCAL.v11.r1` |
| CH₄ TROPOMI/WFMD | `esacci.GHG.satellite-orbit-frequency.L2.CH4.TROPOMI.Sentinel-5P.WFMD.v1-8.201711-202406` |
| CH₄ other 1.8 entry | `esacci.GHG.satellite-orbit-frequency.L2.CH4.TROPOMI.Sentinel-5P.WFMD.v1-8.r1` |
| Greenland merged SEC | `esacci.ICESHEETS.yr.Unspecified.SEC.multi-sensor.multi-platform.UNSPECIFIED.1-2.r1` |
| Greenland CryoSat-2 alternative, 2-year | `esacci.ICESHEETS.yr.Unspecified.SEC.SIRAL.CryoSat-2.UNSPECIFIED.2-2.greenland_sec_cryosat_2yr` |
| Greenland CryoSat-2 alternative, 5-year | `esacci.ICESHEETS.yr.Unspecified.SEC.SIRAL.CryoSat-2.UNSPECIFIED.2-2.greenland_sec_cryosat_5yr` |
| Permafrost NH MODIS | `esacci.PERMAFROST.yr.L4.PFR.multi-sensor.multi-platform.MODISLST_CRYOGRID.05-0.NH` |
| Permafrost NH ERA5 back-extension | `esacci.PERMAFROST.yr.L4.PFR.multi-sensor.multi-platform.ERA5_MODISLST_BIASCORRECTED.05-0.NH` |
| Land-cover global LCCS | `esacci.LC.yr.L4.LCCS.multi-sensor.multi-platform.Map.2-0-7.r1` |
| HR land-cover 30 m, Africa | `esacci.LC.5-yrs.L4.Map.multi-sensor.multi-platform.HRLC30-A01.v1-2.Africa` |
| HR land-cover 30 m, Amazonia | `esacci.LC.5-yrs.L4.Map.multi-sensor.multi-platform.HRLC30-A02.v1-2.Amazonia` |
| HR land-cover 30 m, Siberia | `esacci.LC.5-yrs.L4.Map.multi-sensor.multi-platform.HRLC30-A03.v1-2.Siberia` |
| Sea surface salinity, centred 15-day | `esacci.SEASURFACESALINITY.15-days.L4.SSS.multi-sensor.multi-platform.GLOBAL-MERGED_OI_Monthly_CENTRED_15Day_0-25deg.5-5.r1` |
| Snow water equivalent | `esacci.SNOW.day.L3C.SWE.multi-sensor.multi-platform.MERGED.4-0.r1` |
| Soil moisture COMBINED | `esacci.SOILMOISTURE.day.L3S.SSMV.multi-sensor.multi-platform.COMBINED.v09-2.r1` |
| SST OSTIA (older than our configured source) | `esacci.SST.day.L4.SSTdepth.multi-sensor.multi-platform.OSTIA.2-1.sst` |
| Ocean-colour monthly chlorophyll-a | `esacci.OC.mon.L3S.CHLOR_A.multi-sensor.multi-platform.MERGED.6-0.geographic` |
| Sea-level monthly anomalies | `esacci.SEALEVEL.mon.L4.MSLA.multi-sensor.multi-platform.MERGED.2-0.r1` |
| Sea-state monthly wave height | `esacci.SEASTATE.mon.L4.SWH.multi-sensor.multi-platform.MULTI_1M.4-0.r1` |
| Sea-ice concentration AMSR NH | `esacci.SEAICE.day.L4.SICONC.multi-sensor.multi-platform.AMSR_25kmEASE2.2-1.NH` |
| Sea-ice concentration AMSR SH | `esacci.SEAICE.day.L4.SICONC.multi-sensor.multi-platform.AMSR_25kmEASE2.2-1.SH` |
| Sea-ice concentration alternative NH | `esacci.SEAICE.day.L4.SICONC.multi-sensor.multi-platform.RE_SSMI_12-5kmEASE2-NH.3-0.NH` |
| Sea-ice concentration alternative SH | `esacci.SEAICE.day.L4.SICONC.multi-sensor.multi-platform.RE_SSMI_12-5kmEASE2-SH.3-0.SH` |
| LST SSMI/SSMIS monthly ascending | `esacci.LST.mon.L3C.LST.multi-sensor.multi-platform.SSMI_SSMIS.v2-33.ASC` |
| Water vapour monthly 0.05° | `esacci.WATERVAPOUR.mon.L3S.TCWV.multi-sensor.multi-platform.TCWV_land_005deg.4-2.r1` |
| Vegetation v2 sites | `esacci.VEGETATION.5-days.L3S.VP_PRODUCTS.multi-sensor.multi-platform.MERGED.v2-0.sites` |
| Vegetation v2 tiles | `esacci.VEGETATION.5-days.L3S.VP_PRODUCTS.multi-sensor.multi-platform.MERGED.v2-0.tiles` |
| River water level | `esacci.RD.satellite-orbit-frequency.L3S.WL.multi-sensor.multi-platform.MERGED.v1-1.r1` |
| Lakes combined products | `esacci.LAKES.day.L3S.LK_PRODUCTS.multi-sensor.multi-platform.MERGED.v3-0-0.r1` |
| Ozone total column | `esacci.OZONE.day.L3S.TC.multi-sensor.multi-platform.MERGED.fv0100.r1` |
| Ozone nadir profiles (not an established match to our profile layer) | `esacci.OZONE.mon.L3.NP.multi-sensor.multi-platform.MERGED.fv0002.r1` |
| Antarctic GMB (older representation, store `esa-cci-zarr`) | `ESACCI-ICESHEETS_Antarctica_GMB-2002-2016-v1.1.zarr` |

Lakes 3.0.0 is also listed in **`esa-cci-zarr`** as
`ESACCI-LAKES-L3S-LK_PRODUCTS-MERGED-fv3.0.0.zarr`.

## Repository inconsistencies to keep in mind

These files were inspected but **not changed**:

- `data/downloads/ceda-soil-moisture.sh` requests **8.1**, while the English layer
  metadata says **9.1**; the Toolbox now lists **9.2**.
- `data/downloads/cds-greenhouse-xco2.sh` and `cds-greenhouse-xch4.sh` still refer
  to merged monthly **OBS4MIPS 4.4**, while the current English layer metadata
  identifies **FOCAL 11** and **TROPOMI/WFMD 1.8**, respectively. These are
  different product families, not comparable version numbers.
- Both legacy Lakes download scripts use **1.0**, while the active lake
  temperature layer documents **2.02** and discovery lists **3.0.0**.
- The SST source path contains **3.0.1**, while its layer description says
  **3.0**. Its GHRSST filename also contains `v02.0-fv01.0`; those filename
  components must not be mistaken for the CDR/source-directory version.
- The ozone profile layer's name, variable description and catalogue link do
  not establish a consistent profile product identity.
- Layer/app release versions such as `package.json`'s version and pipeline
  `layer_version` parameters are **not upstream scientific dataset versions**.

## Recheck from the installed environment

```sh
source ~/.local/share/esa-climate-toolbox/.venv313/bin/activate
python
```

```python
from esa_climate_toolbox.core import (
    list_ecvs,
    list_stores,
    list_datasets,
    list_ecv_datasets,
    get_store,
)

print(sorted(list_ecvs()))
print(list_stores())

# Returns (dataset_id, store_id) pairs across registered stores.
for dataset_id, store_id in list_ecv_datasets("PERMAFROST"):
    if ".PFR." in dataset_id:
        print(store_id, dataset_id)

# List once per store when auditing many ECVs.
ids = list(list_datasets("esa-cci"))
for dataset_id in ids:
    if ".SOILMOISTURE." in dataset_id and ".COMBINED." in dataset_id:
        print(dataset_id)

# Inspect a chosen product's metadata separately, avoiding parallel bursts.
# This contacts CEDA and may be throttled; no full dataset is opened here.
descriptor = get_store("esa-cci").describe_data(
    "esacci.SOILMOISTURE.day.L3S.SSMV.multi-sensor.multi-platform.COMBINED.v09-2.r1"
)
print(descriptor.to_dict())
```

The [ESA Biomass data page](https://climate.esa.int/en/projects/biomass/data/)
also independently identifies **7.0** as the latest AGB-map release.
