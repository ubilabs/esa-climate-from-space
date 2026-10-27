#!/usr/bin/env python3
"""Export monthly MODIS Terra burned-area grids v5.1 through ESA Toolbox.

This is the 0.25 degree monthly area sum in m2, not the pixel product,
harmonised sensor product, or burned-area fraction. Keep actual Toolbox
mid-month coordinates; do not aggregate the already monthly source again.
"""

from toolbox_download import main as toolbox_main


DATASET_ID = 'esacci.FIRE.mon.L4.BA.MODIS.Terra.MODIS_TERRA.v5-1.grid'


def main(argv=None):
    return toolbox_main(DATASET_ID, 'burned_area', '5.1', 'fire', 'monthly', '2001-01-01', argv)


if __name__ == '__main__':
    raise SystemExit(main())
