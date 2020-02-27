import React, {FunctionComponent} from 'react';

import {RemoveIcon} from '../icons/remove-icon';

import {LayerListItem} from '../../types/layer-list';

import styles from './selected-layer-list-item.styl';

interface Props {
  layer: LayerListItem;
  isCompare?: boolean;
  onLayerRemove: () => void;
}

const SelectedLayerListItem: FunctionComponent<Props> = ({
  layer,
  isCompare,
  onLayerRemove
}) => (
  <div className={styles.selectedLayerListItem}>
    <div className={styles.layerTitle}>
      <div className={styles.layerIcon}></div>
      <span className={styles.layerTitle}>{layer.name}</span>
    </div>
    {isCompare && (
      <div className={styles.removeIcon} onClick={() => onLayerRemove()}>
        <RemoveIcon />
      </div>
    )}
  </div>
);

export default SelectedLayerListItem;
