import {
  SET_SELECTED_LAYER_ID,
  SetSelectedLayerIdAction
} from '../../actions/set-selected-layer';

import {State} from '../index';

export interface SelectedLayersState {
  main: string | null;
  compare: string | null;
}

const initialState = {
  main: null,
  compare: null
};

function selectedLayersReducer(
  state: SelectedLayersState = initialState,
  action: SetSelectedLayerIdAction
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
export function selectedLayersSelector(state: State): SelectedLayersState {
  return state.layers.selected;
}
export default selectedLayersReducer;
