import {
  SET_SELECTED_LAYERS,
  SetSelectedLayersAction
} from '../../actions/set-selected-layers';
import {selectedLayerIdsSelector, SelectedLayerIdsState} from './selected-ids';
import {layersSelector} from './list';

import {State} from '../index';
import {LayerList, LayerListItem} from '../../types/layer-list';

const initialState: LayerList = [];

function selectedLayersReducer(
  layersState: LayerList = initialState,
  action: SetSelectedLayersAction
): LayerList {
  switch (action.type) {
    case SET_SELECTED_LAYERS:
      return action.layers;
    default:
      return layersState;
  }
}

interface SelectedLayerItems {
  main: LayerListItem | null;
  compare: LayerListItem | null;
}

const getSelectedLayers = (
  layers: LayerList,
  selectedLayerIds: SelectedLayerIdsState
): SelectedLayerItems =>
  layers.reduce(
    (
      selectedLayers: SelectedLayerItems,
      layer: LayerListItem
    ): SelectedLayerItems => {
      if (layer.subLayers.length) {
        const mainLayer = layer.subLayers.find(
          subLayer => subLayer.id === selectedLayerIds.main
        );
        const compareLayer = layer.subLayers.find(
          subLayer => subLayer.id === selectedLayerIds.compare
        );

        return {
          main: mainLayer || selectedLayers.main,
          compare: compareLayer || selectedLayers.compare
        };
      }

      const isMainLayer = layer.id === selectedLayerIds.main;
      const isCompareLayer = layer.id === selectedLayerIds.compare;

      return {
        main: isMainLayer ? layer : selectedLayers.main,
        compare: isCompareLayer ? layer : selectedLayers.compare
      };
    },
    {main: null, compare: null}
  );

export function selectedLayersSelector(state: State): SelectedLayerItems {
  const layers = layersSelector(state);
  const selectedLayerIds = selectedLayerIdsSelector(state);
  return getSelectedLayers(layers, selectedLayerIds);
}

export default selectedLayersReducer;
