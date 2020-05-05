import config from '../config/main';
import {replaceUrlPlaceholders} from '../libs/replace-url-placeholders';
import {
  isElectron,
  isOffline,
  getOfflineTilesUrl
} from '../libs/electron/index';

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

  // decide between remote or local tiles
  const url =
    isElectron() && isOffline() ? getOfflineTilesUrl() : config.api.layerTiles;

  const timeIndex = getLayerTimeIndex(time, layer.timestamps).toString();
  return replaceUrlPlaceholders(url, {
    id: layer.id,
    timeIndex
  });
}

/**
 * Returns the best matching time of all layer timestamps
 * based on the current global time
 */
export function getLayerTimeIndex(
  sliderTime: number,
  timestamps: string[]
): number {
  let minDiff = Infinity;
  let index = timestamps.length - 1;

  for (let i = timestamps.length - 1; i >= 0; i--) {
    const tickTime = Number(new Date(timestamps[i]));
    const diff = Math.abs(sliderTime - tickTime);

    if (diff < minDiff && tickTime <= sliderTime) {
      minDiff = diff;
      index = i;
    }
  }

  const firstTimestamp = Number(new Date(timestamps[0]));

  if (sliderTime <= firstTimestamp) {
    index = 0;
  }

  return index;
}
