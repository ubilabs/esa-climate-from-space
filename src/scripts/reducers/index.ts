import layersReducer, {LayersState} from './layers';
import {FetchLayersSuccessAction} from '../actions/fetch-layers';
import {SetSelectedLayerIdAction} from '../actions/set-selected-layer';
import selectedLayerReducer, {SelectedLayersState} from './selected-layer-id';

export interface State {
  layers: LayersState;
  selectedLayer: SelectedLayersState;
}

export type Action = FetchLayersSuccessAction | SetSelectedLayerIdAction;

const initialState: State = {
  layers: [],
  selectedLayer: {
    main: null,
    compare: null
  }
};

function reducer(state: State = initialState, action: Action): State {
  return {
    layers: layersReducer(state.layers, action),
    selectedLayer: selectedLayerReducer(state.selectedLayer, action)
  };
}

export default reducer;
