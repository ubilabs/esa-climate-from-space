import {State} from './index';
import {
  FETCH_LAYERS_SUCCESS,
  Layer,
  FetchLayersActions
} from '../actions/fetch-layers';

export type LayersState = Layer[];
const initialState: LayersState = [];

function layersReducer(
  layersState: LayersState = initialState,
  action: FetchLayersActions
): LayersState {
  switch (action.type) {
    case FETCH_LAYERS_SUCCESS:
      return action.layers;
    default:
      return layersState;
  }
}

export function layersSelector(state: State) {
  return state.layers;
}

export default layersReducer;
