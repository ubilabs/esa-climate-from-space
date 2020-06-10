import {SelectedLayerIdsState} from '../../reducers/layers/selected-ids';
import {State} from '../../reducers/index';

export function selectedLayerIdsSelector(state: State): SelectedLayerIdsState {
  return state.layers.layerIds;
}
