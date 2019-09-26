import layersReducer, {LayersState} from './layers';
import {FetchLayersSuccessAction} from '../actions/fetch-layers';
import {SetSelectedLayerIdAction} from '../actions/set-selected-layer';
import {SetActiveTabAction} from '../actions/set-active-tab';
import selectedLayerReducer, {SelectedLayersState} from './selected-layer-id';
import setActiveTabReducer, {ActiveTabState} from './active-tab';

export interface State {
  layers: LayersState;
  selectedLayer: SelectedLayersState;
  activeTab: ActiveTabState;
}

export type Action =
  | FetchLayersSuccessAction
  | SetSelectedLayerIdAction
  | SetActiveTabAction;

const initialState: State = {
  layers: [],
  selectedLayer: null,
  activeTab: 'main'
};

function reducer(state: State = initialState, action: Action): State {
  return {
    layers: layersReducer(state.layers, action),
    selectedLayer: selectedLayerReducer(state.selectedLayer, action),
    activeTab: setActiveTabReducer(state.activeTab, action)
  };
}

export default reducer;
