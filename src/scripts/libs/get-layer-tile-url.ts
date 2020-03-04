import config from '../config/main';
import {replaceUrlPlaceholders} from '../libs/replace-url-placeholders';

import {Layer} from '../types/layer';

/**
 * Returns the current layer tile url based on the time and the
 * layer's availbale timestmaps
 */
export function getLayerTileUrl(
  layer: Layer | null,
  time: number
): string | null {
  if (!layer) {
    return null;
  }

  const timeIndex = getLayerTime(time, layer.timestamps).toString();
  return replaceUrlPlaceholders(config.api.layerTiles, {
    id: layer.id,
    timeIndex
  });
}

/**
 * Returns the best matching time of all layer timestamps
 * based on the current global time
 */
function getLayerTime(sliderTime: number, timestamps: string[]): number {
  let index = timestamps.length - 1;

  for (let i = timestamps.length - 1; i > 0; i--) {
    const layerTime = Number(new Date(timestamps[i]));

    if (sliderTime > layerTime) {
      index = i;
      break;
    }
  }

  return index;
}
