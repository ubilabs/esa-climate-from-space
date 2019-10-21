import {
  FETCH_LAYERS_SUCCESS,
  FetchLayersActions
} from '../../actions/fetch-layers';

import {State} from '../index';
import {LayerList} from '../../types/layer-list';

const initialState: LayerList = [];

function layersReducer(
  layersState: LayerList = initialState,
  action: FetchLayersActions
): LayerList {
  switch (action.type) {
    case FETCH_LAYERS_SUCCESS:
      return action.layers;
    default:
      return layersState;
  }
}

export function layersSelector(state: State): LayerList {
  return state.layers.list;
}

export default layersReducer;
