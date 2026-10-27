#!/usr/bin/env python3
"""Export monthly land total-column water vapour v4.2 on the 0.05° grid."""

from toolbox_download import main


DATASET_ID = 'esacci.WATERVAPOUR.mon.L3S.TCWV.multi-sensor.multi-platform.TCWV_land_005deg.4-2.r1'


if __name__ == '__main__':
    raise SystemExit(main(DATASET_ID, 'tcwv', '4.2', 'water_vapour', 'monthly', '2000-03-01'))
