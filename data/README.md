# Tile Pyramid Generation

## Download Fire Burned Area v5.1 through ESA Toolbox

`data/downloads/toolbox-fire.py` uses the primary `esa-cci` store and the exact
MODIS Terra monthly 0.25° grid product:
`esacci.FIRE.mon.L4.BA.MODIS.Terra.MODIS_TERRA.v5-1.grid`.
It exports only `burned_area` in **m²**, retaining the monthly area sums; it does
not calculate monthly means, convert to fractions, or use the harmonised/pixel
products. Activate `esa-toolbox` as described below, then run:

```sh
# Preview all available months without downloading climate-data arrays.
python data/downloads/toolbox-fire.py --dry-run

# First global monthly file.
caffeinate -i python data/downloads/toolbox-fire.py --max-files 1

# Full series; rerun the same command after a failure to skip completed files.
caffeinate -i python data/downloads/toolbox-fire.py
```

Outputs are isolated under `download/fire/v5.1/` with an identity manifest and
atomic per-month publication. Do not mix them with the legacy `download/fire/*.nc`
files. A failed month restarts; already completed matching months are skipped.
Use a different output directory for regional `--bbox` tests.

Live verification on 27 October 2026 found **264 months, January 2001–December
2022**, preserving all 240 development-layer months (January 2001–December 2020)
and adding 24 months. The previous pipeline already used release 5.1: this is a
Toolbox migration and coverage extension, not a release-number increase.

**Timestamp change:** Toolbox uses monthly interval midpoints (e.g.
`2001-01-16T12:00:00` → `20010116.nc`), whereas the existing files use month-start
labels. No calendar months are missing, but exact dates differ for every old
month. NetCDFs preserve the complete source timestamp; the current image DAG
derives date-only labels from filenames and therefore drops any noon component.
Do not silently relabel these exports to month starts or mix old and new date
labels when staging. Verify story/date dependencies before publication.

The legacy source explicitly replaced October–December 2019 with corrected files.
A live Toolbox export of all three months confirmed that its OPeNDAP requests
use the `2019/new-corrected/` directory, not `old-redacted/`.

Downloading does not stage to GCS or publish images. See the Fire runbook in
`pipeline/README.md` for the manual processing/publication steps.

## Download biomass through the modern ESA Climate Toolbox

`data/downloads/toolbox-biomass.py` reads the native 100 m MERGED AGB **v7.0**
product through the Toolbox's `esa-cci` store:
`esacci.BIOMASS.yr.L4.AGB.multi-sensor.multi-platform.MERGED.7-0.100m`.
It does not invoke the direct CEDA downloader. This requires the modern
`esa-toolbox` environment, not the legacy Cate environment described below.
Run `bash data/setup-toolbox.sh` if setup is needed, then activate the environment
using the instructions it prints.

From the repository root, preview the first annual export without reading
climate-data variables or writing output:

```sh
python data/downloads/toolbox-biomass.py --dry-run --max-files 1
```

For a small regional test (west, south, east, north), use a separate directory:

```sh
python data/downloads/toolbox-biomass.py \
  --bbox 10 50 10.1 50.1 --max-files 1 \
  --output-dir download/biomass-test/v7.0
```

Then start a single global annual export on macOS, preventing idle sleep:

```sh
caffeinate -i python data/downloads/toolbox-biomass.py --max-files 1
```

The default output is `download/biomass/v7.0/YYYYMMDD.nc`, using actual source
timestamps, with `agb`, its referenced CRS, and source dataset provenance.
Annual dates are selected from the available Toolbox time coordinates; no
missing years are fabricated. Use `--start-date` and `--end-date` to bound the
selection. Remove `--max-files 1` for all available annual maps.

Global 100 m exports are large and may take substantial memory, disk, and network
time. The earlier 335 GB estimate describes the original CEDA NetCDFs, not a
measured size for these Toolbox exports of AGB alone. Test a region first and
consider an external SSD with `--output-dir` for the full dataset.

### Resuming interrupted Toolbox biomass exports

Completed, matching NetCDFs are verified for provenance/timestamp and skipped
when rerun. Within an unfinished year, successfully downloaded spatial blocks
are checkpointed as compressed files under:

```text
download/biomass/v7.0/.chunks/YYYYMMDD/
```

**Rerun the same command to resume.** Valid cached blocks are reused; only missing
or corrupt blocks are downloaded again. Each block is written atomically and
checked for its grid/window, dtype, source identity, and ZIP integrity. Interrupted
chunk writes are not treated as completed blocks. The cache defaults to native
Toolbox chunks (1875 × 1875 cells in the tested global biomass product), fetched
sequentially with up to three attempts per remote block. Progress is printed as
`CHUNK 123/18144`, including reused and newly downloaded block counts.

Once every block is cached, the annual NetCDF is assembled **from local blocks**
with bounded memory and published atomically. A failure during assembly retains
the checkpoints, so the annual export can be rebuilt without re-downloading
its climate-data blocks. Restarting the CLI still requires Toolbox metadata and
coordinate access. This is spatial checkpointing, not HTTP byte-range resume.

By default, known checkpoints are removed only after a complete matching annual
NetCDF has been published; failures retain them. Use `--keep-chunks` to retain
them even after success. Caches plus the assembling annual file require extra
disk space while a year is in progress.

Optional controls:

```sh
# Smaller spatial checkpoints; keep these settings unchanged when resuming.
caffeinate -i python data/downloads/toolbox-biomass.py \
  --max-files 1 --chunk-size 1024 --chunk-retries 3

# Retain checkpoints after successful publication too.
python data/downloads/toolbox-biomass.py --max-files 1 --keep-chunks
```

Changing the source/grid, encoding, timestamp, or chunk plan rejects an existing
cache rather than silently mixing incompatible blocks. Use the original settings
to resume, or choose a different output directory. Downloads to the same output
directory are locked against concurrent writers, including the direct-CEDA
biomass downloader. Old, failed non-checkpointed `.part` files cannot be resumed
by this scheme; only blocks saved by the new exporter can be reused.

Do not run both downloaders against the same directory or mix global and regional
exports. Incompatible manifests are rejected without overwriting existing files;
choose a different output directory instead.

## Download biomass directly from CEDA

For global maps, `data/downloads/ceda-biomass-agb.py` avoids the Toolbox's many
small OPeNDAP requests by streaming the original annual NetCDFs directly over
HTTPS. It selects the same MERGED AGB v7.0 100 m release: 18 annual maps for
2005–2012 and 2015–2024. The archive listing checked on 27 October 2026 totals
about 335 GB; each annual file is approximately 18–19 GB. Transfer performance
depends on the server/network and is not guaranteed by the different backend.

Use the activated `esa-toolbox` environment for its NetCDF validation dependency:

```sh
# Preview source URLs and sizes without downloading data.
python data/downloads/ceda-biomass-agb.py --dry-run --max-files 1

# Download the first year, with idle sleep inhibited on macOS.
caffeinate -i python data/downloads/ceda-biomass-agb.py --max-files 1

# After checking the first file, download all remaining available years.
caffeinate -i python data/downloads/ceda-biomass-agb.py
```

The default output is intentionally separate from Toolbox exports:
`download/biomass-ceda/v7.0/YYYY0101.nc`. Native CEDA annual timestamps use
1 January, unlike the Toolbox's mid-year labels. Use an external disk with
`--output-dir /Volumes/YOUR_SSD/esa/biomass-ceda/v7.0` if needed, and keep that
same directory when resuming.

The downloader prints bytes transferred, transfer rate and ETA. It retains
tracked `.ceda.part` files and identity sidecars on connection failures or
Ctrl+C. Rerunning the same command resumes the remaining bytes with HTTP Range
when supported; if the server ignores Range it safely restarts that file.
Completed files are verified and skipped. Publication requires matching source
size, MD5 checksum, NetCDF signature, and v7.0/year/grid/variable metadata.

Toolbox checkpoints cannot be reused as byte ranges of an original CEDA file.
Keep `download/biomass/v7.0/.chunks/` if you want to retain the option to resume
the Toolbox export; the separate CEDA default does not modify it. Do not point
both backends at the same output directory. Direct full-file downloads do not
support `--bbox`.

Neither downloader publishes tiles or updates the Airflow source bucket
automatically. The original CEDA files also contain uncertainty/other source
fields rather than only the Toolbox-exported `agb` and CRS.

## Requirements

These tools are required to run the tile generation scripts in this folder:

- ESA CCI Toolbox (Cate) https://github.com/CCI-Tools/cate
- xcube https://xcube.readthedocs.io/en/latest/

Optional tools to work with and explore datasets:

- Cate Desktop (GUI for the ESA CCI Toolbox) https://github.com/CCI-Tools/cate-desktop
- Jupyter Lab

## Generate Tiles from zarr file

`xcube tiles ../cate/myzarr.zarr`

## CI Pipeline

The cloud build task `cloudbuild-tiles` runs several docker containers to produce
tiles for a given dataset and variable Id. The result of the pipeline is a folder
in the cloud storage bucket `gs://esa-cfs-tiles/{VERSION}/{LAYER_ID}`.

The folder includes:

- tiles and a full global image for every timestamp
- metadata.json with timestamp mappings
- a `package.zip` with the above data to download for offline mode
