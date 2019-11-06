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
  const selectedLayers = useSelector(selectedLayersSelector);
  const layers = useSelector(layersSelector);
  let selectedMain: LayerListItem | null = null;
  let selectedCompare: LayerListItem | null = null;

  const layerbyId = (layer: LayerListItem) => {
    if (layer.subLayers.length === 0) {
      if (selectedLayers.main === layer.id) {
        selectedMain = layer;
      }
      if (selectedLayers.compare === layer.id) {
        selectedCompare = layer;
      }
    }
    layer.subLayers.forEach((sublayer: LayerListItem) => {
      if (selectedLayers.main === sublayer.id) {
        selectedMain = sublayer;
      }
    });
    layer.subLayers.forEach((sublayer: LayerListItem) => {
      if (selectedLayers.compare === sublayer.id) {
        selectedCompare = sublayer;
      }
    });
  };

  layers.forEach(layerbyId);

  const mainLayerName = selectedMain && (selectedMain as LayerListItem).name;
  const mainLayerDescription =
    selectedMain && (selectedMain as LayerListItem).description;
  const compareLayerName =
    selectedCompare && (selectedCompare as LayerListItem).name;
  const compareLayerDescription =
    selectedCompare && (selectedCompare as LayerListItem).description;

  return (
    <div className={styles.dataSetInfo}>
      <h1 className={styles.title}>
        {isMain ? mainLayerName : compareLayerName}
      </h1>
      <h2 className={styles.description}>
        {isMain ? mainLayerDescription : compareLayerDescription}
      </h2>
    </div>
  );
};

export default DataSetInfo;
