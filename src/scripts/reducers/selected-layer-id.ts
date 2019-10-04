import {
  SET_SELECTED_LAYER_ID,
  LayerId,
  SetSelectedLayerIdAction
} from '../actions/set-selected-layer';
import {State} from './index';

export type SelectedLayersState = LayerId[];

function selectedLayerReducer(
  state: SelectedLayersState = [],
  action: SetSelectedLayerIdAction
): SelectedLayersState {
  switch (action.type) {
    case SET_SELECTED_LAYER_ID:
      const newState = [...state];
      newState[action.isPrimary ? 0 : 1] = action.layerId;
      return newState;
    default:
      return state;
  }
}
export function selectedLayerIdSelector(state: State) {
  return state.selectedLayer;
}
export default selectedLayerReducer;
