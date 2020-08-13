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

def write_world_file(shape, attributes):
  lat_min = -90
  lat_max = 90
  lon_min = -180
  lon_max = 180

  try:
    lat_min = float(attributes['geospatial_lat_min'])
    lat_max = float(attributes['geospatial_lat_max'])
    lon_min = float(attributes['geospatial_lon_min'])
    lon_max = float(attributes['geospatial_lon_max'])
  except KeyError:
    print("Write Worldfile: Could not read geospatil info using defauls!")

  lon_res = (abs(lon_min) + abs(lon_max)) / shape[2]
  lat_res = (abs(lat_min) + abs(lat_max)) / shape[1]

  content = """{a}\n{b}\n{c}\n{d}\n{e}\n{f}""".format(
    a = lon_res,
    b = 0,
    c = 0,
    d = lat_res * -1,
    e = lon_min + (lon_res / 2),
    f = lat_max - (lat_res / 2)
  )

  with open('./worldfile.wld', 'w') as f:
    f.write(content)

  print(content)


def write_metadata_file(layer_id, variable_id, units, timesteps, max_zoom, min, max):
  with open('./data/layers-config.json') as f:
    layer_config = json.load(f)

  format_date = lambda t: np.datetime_as_string(t, timezone='UTC')
  timestamps = [format_date(t) for t in timesteps.values]
  layer_data = layer_config[layer_id]

  metadata = {
    'id': layer_id,
    'minValue': min,
    'maxValue': max,
    'zoomLevels': max_zoom,
    'timestamps': timestamps,
    'units': units,
    **layer_config[layer_id]
  }

  with open('./metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

  print(metadata)
