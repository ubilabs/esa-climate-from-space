#!/usr/bin/env python3
"""Export annual Biomass v7.0 AGB maps through the ESA Climate Toolbox.

Uses the native 100 m MERGED product in the esa-cci store. Supports metadata-only
previews, regional bounding boxes, and resumable spatial checkpoints; no
direct-CEDA downloader is invoked.
The separate ceda-biomass-agb.py command retains that download option.
"""

from toolbox_download import main as toolbox_main


DATASET_ID = 'esacci.BIOMASS.yr.L4.AGB.multi-sensor.multi-platform.MERGED.7-0.100m'


def main(argv=None):
    return toolbox_main(DATASET_ID, 'agb', '7.0', 'biomass', 'annual', '2005-01-01', argv, chunked=True)


if __name__ == '__main__':
    raise SystemExit(main())
