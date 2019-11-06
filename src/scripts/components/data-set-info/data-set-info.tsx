import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';

import {selectedLayersSelector} from '../../reducers/layers/selected';
import {layersSelector} from '../../reducers/layers/list';

import styles from './data-set-info.styl';
import {LayerListItem} from '../../types/layer-list';

interface Props {
  isMain?: boolean;
}

const DataSetInfo: FunctionComponent<Props> = ({isMain}) => {
  const selectedLayerIds = useSelector(selectedLayersSelector);
  const layers = useSelector(layersSelector);

  const {main, compare} = layers.reduce(
    (
      selectedLayers: {
        main: LayerListItem | null;
        compare: LayerListItem | null;
      },
      layer: LayerListItem
    ): {
      main: LayerListItem | null;
      compare: LayerListItem | null;
    } => {
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
      console.log('isMainLayer', isMainLayer);

      return {
        main: isMainLayer ? layer : selectedLayers.main,
        compare: isCompareLayer ? layer : selectedLayers.compare
      };
    },
    {main: null, compare: null}
  );

  return (
    <div className={styles.dataSetInfo}>
      <h1 className={styles.title}>
        {isMain ? main && main.name : compare && compare.name}
      </h1>
      <h2 className={styles.description}>
        {isMain ? main && main.description : compare && compare.description}
      </h2>
    </div>
  );
};

export default DataSetInfo;
