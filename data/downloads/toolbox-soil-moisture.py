#!/usr/bin/env python3
"""Export monthly snapshots of COMBINED volumetric soil moisture v9.2.

The source is daily. Keep the existing pipeline's earliest-day-per-month
sampling; this does not calculate monthly means or download every daily record.
"""

from toolbox_download import main


DATASET_ID = 'esacci.SOILMOISTURE.day.L3S.SSMV.multi-sensor.multi-platform.COMBINED.v09-2.r1'


if __name__ == '__main__':
    raise SystemExit(main(DATASET_ID, 'sm', '9.2', 'soil_moisture', 'monthly', '1978-11-01'))
