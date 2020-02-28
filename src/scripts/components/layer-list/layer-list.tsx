import React, {FunctionComponent} from 'react';

import LayerListItem from '../layer-list-item/layer-list-item';

import {LayerListItem as LayerListItemType} from '../../types/layer-list';

import styles from './layer-list.styl';

interface Props {
  selectedIds: string[];
  layers: LayerListItemType[];
  onMainSelect: (id: string) => void;
  onCompareSelect: (id: string) => void;
}

const LayerList: FunctionComponent<Props> = ({
  selectedIds,
  layers,
  onMainSelect,
  onCompareSelect
}) => {
  const [mainId] = selectedIds;
  const mainSelected = Boolean(mainId);

  return (
    <ul className={styles.layerList}>
      {layers
        .filter(layer => !selectedIds.includes(layer.id))
        .map(layer => (
          <li key={layer.id}>
            <LayerListItem
              onMainSelect={id => onMainSelect(id)}
              onCompareSelect={id => onCompareSelect(id)}
              isMainSelected={mainSelected}
              layer={layer}
            />
          </li>
        ))}
    </ul>
  );
};

export default LayerList;
