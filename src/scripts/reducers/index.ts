import layersReducer, {LayersState} from './layers';
import {FetchLayersSuccessAction} from '../actions/fetch-layers';

export interface State {
  layers: LayersState;
}

export type Action = FetchLayersSuccessAction;

const initialState: State = {
  layers: []
};

function reducer(state: State = initialState, action: Action): State {
  return {
    layers: layersReducer(state.layers, action)
  };
}

export default reducer;
