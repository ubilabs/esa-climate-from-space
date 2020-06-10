import {
  SET_SELECTED_LAYER_ID,
  SetSelectedLayerIdAction
} from '../../actions/set-selected-layer-id';
import {parseUrl} from '../../libs/globe-url-parameter';

export interface SelectedLayerIdsState {
  mainId: string | null;
  compareId: string | null;
}

// get layer ids from url once on load
const initialState = parseUrl()?.layerIds || {mainId: null, compareId: null};

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
