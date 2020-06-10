import {
  SHOW_LAYER_SELECTOR,
  ShowLayerSelectorAction
} from '../actions/show-layer-selector';

const initialState = false;

function showLayerSelectorReducer(
  state: boolean = initialState,
  action: ShowLayerSelectorAction
): boolean {
  switch (action.type) {
    case SHOW_LAYER_SELECTOR:
      return action.showLayerSelector;
    default:
      return state;
  }
}

export default showLayerSelectorReducer;
