import config from '../config/main';
import {replaceUrlPlaceholders} from './replace-url-placeholders';
import {isElectron, isOffline, getOfflineTilesUrl} from './electron/index';

import {Layer} from '../types/layer';
import {GlobeImageLayerData} from '../types/globe-image-layer-data';
import {LayerType} from '../types/globe-layer-type';

const NUM_PRELOAD_URLS = 5;

/**
 * Returns the current layer tile url based on the time and the
 * layer's availbale timestmaps
 */
export function getImageLayerData(
  layer: Layer | null,
  time: number
): GlobeImageLayerData | null {
  if (!layer) {
    return null;
  }

  let url = {
    [LayerType.Tiles]: config.api.layerTiles,
    [LayerType.Image]: config.api.layerImage,
    [LayerType.Gallery]: config.api.layerGalleryImage
  }[layer.type];

  // use local tiles when offline and in electron
  if (isElectron() && isOffline()) {
    url = getOfflineTilesUrl(layer.type);
  }

  const timeIndex = getLayerTimeIndex(time, layer.timestamps);
  const replacedUrl = replaceUrlPlaceholders(url, {
    id: layer.id,
    timeIndex: timeIndex.toString()
  });

  const nextUrls = Array.from({length: NUM_PRELOAD_URLS})
    .map((n, index) => timeIndex + index)
    .filter(index => index < layer.timestamps.length)
    .map(index =>
      replaceUrlPlaceholders(url, {
        id: layer.id,
        timeIndex: index.toString()
      })
    );

  return {
    id: layer.id,
    type: layer.type,
    url: replacedUrl,
    nextUrls,
    zoomLevels: layer.zoomLevels || 0
  };
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
