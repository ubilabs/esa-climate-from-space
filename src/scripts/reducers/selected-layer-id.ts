import {SET_SELECTED_LAYER_ID, LayerId} from '../actions/set-selected-layer';
import {Action, State} from './index';

export interface SelectedLayersState {
  main: LayerId | null;
  compare: LayerId | null;
}

const initialState = {
  main: null,
  compare: null
};

function selectedLayerReducer(
  state: SelectedLayersState = initialState,
  action: Action
): SelectedLayersState {
  switch (action.type) {
    case SET_SELECTED_LAYER_ID:
      const newState = {...state};
      const key = action.isPrimary ? 'main' : 'compare';
      newState[key] = action.layerId;
      return newState;
    default:
      return state;
  }
}
export function selectedLayerIdSelector(state: State): SelectedLayersState {
  return state.selectedLayer;
}
export default selectedLayerReducer;
