import layersReducer, {LayersState} from './layers';
import {AddLayersAction} from '../actions/layers';

export interface State {
  layers: LayersState;
}

export type Action = AddLayersAction;

const initialState: State = {
  layers: []
};

function reducer(state: State = initialState, action: Action): State {
  return {
    layers: layersReducer(state.layers, action)
  };
}

export default reducer;
