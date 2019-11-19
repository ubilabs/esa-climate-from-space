import {layersSelector} from './list';
import {State} from '../../reducers/index';

import {LayerListItem} from '../../types/layer-list';

export function layerListItemSelector(
  state: State,
  layerId?: string | null
): LayerListItem | null {
  if (!layerId) {
    return null;
  }

  const layers = layersSelector(state);
  // @ts-ignore
  const subLayers = layers.map(layer => layer.subLayers).flat();
  const allLayers = [...layers, ...subLayers];
  return allLayers.find(layer => layer.id === layerId) || null;
}
