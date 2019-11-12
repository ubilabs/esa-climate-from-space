import {SelectedLayerIdsState} from '../../reducers/layers/selected-ids';
import {layersSelector} from '../../selectors/layers/list';
import {selectedLayerIdsSelector} from '../../selectors/layers/selected-ids';
import {State} from '../../reducers/index';

import {LayerList, LayerListItem} from '../../types/layer-list';

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
