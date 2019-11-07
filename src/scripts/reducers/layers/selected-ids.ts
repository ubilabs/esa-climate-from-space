import {
  SET_SELECTED_LAYER_IDS,
  SetSelectedLayerIdsAction
} from '../../actions/set-selected-layer-ids';

import {State} from '../index';

export interface SelectedLayerIdsState {
  main: string | null;
  compare: string | null;
}

const initialState = {
  main: null,
  compare: null
};

function selectedLayerIdsReducer(
  state: SelectedLayerIdsState = initialState,
  action: SetSelectedLayerIdsAction
): SelectedLayerIdsState {
  switch (action.type) {
    case SET_SELECTED_LAYER_IDS:
      const newState = {...state};
      const key = action.isPrimary ? 'main' : 'compare';
      newState[key] = action.layerIds;
      return newState;
    default:
      return state;
  }
}
export function selectedLayerIdsSelector(state: State): SelectedLayerIdsState {
  return state.layers.selectedIds;
}
export default selectedLayerIdsReducer;
