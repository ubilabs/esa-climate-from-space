import {layersSelector} from '../../selectors/layers/list';
import {State} from '../../reducers/index';

import {LayerList, LayerListItem} from '../../types/layer-list';

interface SelectedLayerItems {
  main: LayerListItem | null;
  compare: LayerListItem | null;
}

interface SelectedLayerIds {
  mainLayerId: string | undefined;
  compareLayerId: string | undefined;
}

const getSelectedLayers = (
  layers: LayerList,
  selectedLayerIds: SelectedLayerIds
): SelectedLayerItems => {
  const {mainLayerId, compareLayerId} = selectedLayerIds;

  return layers.reduce(
    (
      selectedLayers: SelectedLayerItems,
      layer: LayerListItem
    ): SelectedLayerItems => {
      if (layer.subLayers.length) {
        const mainLayer = layer.subLayers.find(
          subLayer => subLayer.id === mainLayerId
        );
        const compareLayer = layer.subLayers.find(
          subLayer => subLayer.id === compareLayerId
        );

        return {
          main: mainLayer || selectedLayers.main,
          compare: compareLayer || selectedLayers.compare
        };
      }

      const isMainLayer = layer.id === mainLayerId;
      const isCompareLayer = layer.id === compareLayerId;

      return {
        main: isMainLayer ? layer : selectedLayers.main,
        compare: isCompareLayer ? layer : selectedLayers.compare
      };
    },
    {main: null, compare: null}
  );
};

export function selectedLayersSelector(
  state: State,
  props: {[key: string]: string} | null
): SelectedLayerItems {
  const layers = layersSelector(state);
  const {mainLayerId, compareLayerId} = props || {};
  return getSelectedLayers(layers, {mainLayerId, compareLayerId});
}
