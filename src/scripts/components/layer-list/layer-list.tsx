import React, {FunctionComponent} from 'react';

import LayerListItem from '../layer-list-item/layer-list-item';

import {SelectedLayerIdsState} from '../../reducers/layers/selected-ids';

import {LayerListItem as LayerListItemType} from '../../types/layer-list';

import {GlobeView} from '../../types/globe-view';

import styles from './layer-list.styl';

interface Props {
  selectedLayerIds: SelectedLayerIdsState;
  layers: LayerListItemType[];
  onSelect: (id: string, flyTo: GlobeView, isMain: boolean) => void;
}

const LayerList: FunctionComponent<Props> = ({
  selectedLayerIds,
  layers,
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
              onSelect={(id, flyTo, isMain) => onSelect(id, flyTo, isMain)}
              isMainSelected={isMainSelected}
              layer={layer}
            />
          </li>
        ))}
    </ul>
  );
};

export default LayerList;
