import {State} from '../../reducers/index';

import {Layer} from '../../types/layer';

export function layerDetailsSelector(
  state: State,
  layerId?: string | null
): Layer | null {
  if (!layerId) {
    return null;
  }

  return state.layers.details[layerId] || null;
}
