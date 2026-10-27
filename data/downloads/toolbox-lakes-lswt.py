#!/usr/bin/env python3
"""Compatibility command for Lakes v3.0.0, now downloaded directly from CEDA.

The release/variable/time coverage were verified with the ESA Toolbox. Transfer
daily NetCDFs instead of the time-series-optimized Zarr cube; export monthly
LSWT snapshots in native Kelvin. No Toolbox/Zarr climate-data reads are made.
"""

from ceda_lakes_download import main


if __name__ == '__main__':
    raise SystemExit(main())
