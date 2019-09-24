import {FETCH_LAYERS_SUCCESS, Layer} from '../actions/fetch-layers';
import {Action, State} from './index';

export type LayersState = Layer[];
const initialState: LayersState = [];

function layersReducer(
  layersState: LayersState = initialState,
  action: Action
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
