import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';

import {LayerListItem as LayerListItemType} from '../../types/layer-list';

import styles from './layer-list-item.styl';

interface Props {
  layer: LayerListItemType;
  isMainSelected: boolean;
  onMainSelect: (id: string) => void;
  onCompareSelect: (id: string) => void;
}

const LayerListItem: FunctionComponent<Props> = ({
  layer,
  isMainSelected,
  onMainSelect,
  onCompareSelect
}) => (
  <div className={styles.layerItem} onClick={() => onMainSelect(layer.id)}>
    <span className={styles.layerTitle}>{layer.name}</span>
    {isMainSelected && (
      <button
        className={styles.compare}
        onClick={event => {
          onCompareSelect(layer.id);
          event.stopPropagation();
        }}>
        <FormattedMessage id={'layerSelector.compare'} />
      </button>
    )}
  </div>
);

export default LayerListItem;
