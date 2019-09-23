import {ADD_LAYERS} from '../actions/layers';
import {Action, State} from './index';

export type LayersState = number[];
const initialState: LayersState = [];

function layersReducer(
  layersState: LayersState = initialState,
  action: Action
): LayersState {
  switch (action.type) {
    case ADD_LAYERS:
      return layersState.concat(action.layers);
    default:
      return layersState;
  }
}

export function layersSelector(state: State) {
  return state.layers;
}

export default layersReducer;
