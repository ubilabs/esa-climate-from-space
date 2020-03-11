import React, {FunctionComponent} from 'react';

import LayerListItem from '../layer-list-item/layer-list-item';

import {SelectedLayerIdsState} from '../../reducers/layers/selected-ids';

import {DownloadProgress} from '../../types/download-progress';
import {LayerListItem as LayerListItemType} from '../../types/layer-list';

import styles from './layer-list.styl';

interface Props {
  selectedLayerIds: SelectedLayerIdsState;
  layers: LayerListItemType[];
  downloadedLayerIds: string[];
  downloadProgress: DownloadProgress;
  onSelect: (id: string, isMain: boolean) => void;
}

const LayerList: FunctionComponent<Props> = ({
  selectedLayerIds,
  layers,
  downloadedLayerIds,
  downloadProgress,
  onSelect
}) => {
  const {mainId} = selectedLayerIds;
  const isMainSelected = Boolean(mainId);

  return (
    <ul className={styles.layerList}>
      {layers
        .filter(layer => !Object.values(selectedLayerIds).includes(layer.id))
        .map(layer => (
          <li key={layer.id}>
            <LayerListItem
              onSelect={(id, isMain) => onSelect(id, isMain)}
              isMainSelected={isMainSelected}
              isDownloaded={downloadedLayerIds.includes(layer.id)}
              downloadProgress={downloadProgress}
              layer={layer}
            />
          </li>
        ))}
    </ul>
  );
};

export default LayerList;
