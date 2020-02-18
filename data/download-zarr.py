import cate.ops

# example to export a dataset from cate with one variable (cfc)
ds_1 = cate.ops.open_dataset(ds_id="esacci.CLOUD.mon.L3C.CLD_PRODUCTS.multi-sensor.multi-platform.ATSR2-AATSR.2-0.r1", time_range="2010-01-01,2010-06-01", var_names="cfc", force_local=True)

# save to local zarr file
ds_1.to_zarr('./myzarr.zarr')
