import {
  SET_SELECTED_LAYER_ID,
  SetSelectedLayerIdAction
} from '../../actions/set-selected-layer-id';

export interface SelectedLayerIdsState {
  mainId: string | null;
  compareId: string | null;
}

const initialState = {
  mainId: null,
  compareId: null
};

function selectedLayerIdsReducer(
  state: SelectedLayerIdsState = initialState,
  action: SetSelectedLayerIdAction
): SelectedLayerIdsState {
  switch (action.type) {
    case SET_SELECTED_LAYER_ID:
      const newState = {...state};
      const key = action.isPrimary ? 'mainId' : 'compareId';
      newState[key] = action.layerId;
      return newState;
    default:
      return state;
  }
}

export default selectedLayerIdsReducer;
