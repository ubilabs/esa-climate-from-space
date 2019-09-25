import {SET_SELECTED_LAYER_ID, LayerId} from '../actions/set-selected-layer';
import {Action, State} from './index';

export type SelectedLayersState = LayerId | null;

function selectedLayerReducer(
  selectedLayerIdState: SelectedLayersState = null,
  action: Action
): SelectedLayersState {
  switch (action.type) {
    case SET_SELECTED_LAYER_ID:
      return action.layerId;
    default:
      return selectedLayerIdState;
  }
}

export function selectedLayerIdSelector(state: State) {
  return state.selectedLayer;
}

export default selectedLayerReducer;
