import {LayerList} from '../types/layer-list';

export const SET_SELECTED_LAYERS = 'SET_SELECTED_LAYERS';

export interface SetSelectedLayersAction {
  type: typeof SET_SELECTED_LAYERS;
  layers: LayerList;
}

const setSelectedLayersAction = (
  layers: LayerList
): SetSelectedLayersAction => ({
  type: SET_SELECTED_LAYERS,
  layers
});

export default setSelectedLayersAction;
