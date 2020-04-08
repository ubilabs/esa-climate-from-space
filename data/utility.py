import json
import math
import numpy as np

def write_style_file(layer_id, variable_id, min, max):
  with open('./data/layers-config.json') as f:
    layer_config = json.load(f)

  content = """Styles:
    - Identifier: cfs
      ColorMappings:
        {variable}:
          ColorBar: {colormap}
          ValueRange: [{min}, {max}]""".format(
            min=min,
            max=max,
            variable=variable_id,
            colormap=layer_config[layer_id]['colorMap']
          )

  with open('./style.yaml', 'w') as f:
    f.write(content)

  print(content)


def write_world_file(ds):
  lon_res = float(ds.attrs['geospatial_lon_resolution'])
  lat_res = float(ds.attrs['geospatial_lat_resolution'])

  content = """{a:.4f}\n{b:.4f}\n{c:.4f}\n{d:.4f}\n{e:.4f}\n{f:.4f}""".format(
    a=lon_res * 2,
    b=0,
    c=0,
    d=lat_res * -2,
    e=-180 - lon_res,
    f=270 - lat_res
  )

  with open('./worldfile.wld', 'w') as f:
    f.write(content)

  print(content)


def write_metadata_file(layer_id, variable_id, timesteps, max_zoom, min, max):
  with open('./data/layers-config.json') as f:
    layer_config = json.load(f)

  format_date = lambda t: np.datetime_as_string(t, timezone='UTC')
  timestamps = [format_date(t) for t in timesteps.values]

  metadata = {
    'id': layer_id,
    'colorMap': layer_config[layer_id]['colorMap'],
    'timeFormat': layer_config[layer_id]['timeFormat'],
    'minValue': min,
    'maxValue': max,
    'zoomLevels': max_zoom,
    'timestamps': timestamps
  }

  with open('./metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

  print(metadata)
