import config from '../config/main';
import {replaceUrlPlaceholders} from '../libs/replace-url-placeholders';

import {DetailsById} from '../reducers/layers/details';

/**
 * Returns the current layer tile url based on the time and the
 * layer's availbale timestmaps
 */
export function getLayerTileUrl(
  id: string | null,
  detailedLayers: DetailsById,
  time: number
): string | null {
  if (!id) {
    return null;
  }

  const layer = detailedLayers[id];

  if (!layer) {
    return null;
  }

  const layerTime = getLayerTime(time, layer.timestamps);
  const date = new Date(layerTime);
  const name = date
    .toISOString()
    .substr(0, 10)
    .replace(/-/g, '');

  return replaceUrlPlaceholders(config.api.layerTiles, {id, name});
}

/**
 * Returns the best matching time of all layer timestamps
 * based on the current global time
 */
function getLayerTime(sliderTime: number, timestamps: string[]): number {
  const lastTimestamp = timestamps[timestamps.length - 1];
  let time = Number(new Date(lastTimestamp));

  for (let i = timestamps.length - 1; i > 0; i--) {
    const layerTime = Number(new Date(timestamps[i]));

    if (sliderTime > layerTime) {
      time = layerTime;
      break;
    }
  }

  return time;
}
