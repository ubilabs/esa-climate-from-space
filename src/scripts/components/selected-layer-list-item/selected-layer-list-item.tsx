import React, {FunctionComponent} from 'react';

import {RemoveIcon} from '../icons/remove-icon';

import {LayerListItem} from '../../types/layer-list';

import styles from './selected-layer-list-item.styl';

interface Props {
  layer: LayerListItem;
  showRemoveButton?: boolean;
  onRemove: () => void;
}

const SelectedLayerListItem: FunctionComponent<Props> = ({
  layer,
  showRemoveButton,
  onRemove
}) => (
  <div className={styles.selectedLayerListItem}>
    <div className={styles.layerTitle}>
      <div className={styles.layerIcon}></div>
      <span className={styles.layerTitle}>{layer.name}</span>
    </div>
    {showRemoveButton && (
      <button className={styles.removeIcon} onClick={() => onRemove()}>
        <RemoveIcon />
      </button>
    )}
  </div>
);

export default SelectedLayerListItem;
