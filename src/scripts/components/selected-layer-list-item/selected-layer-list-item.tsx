import React, {FunctionComponent} from 'react';

import {RemoveIcon} from '../icons/remove-icon';

import {LayerListItem} from '../../types/layer-list';

import styles from './selected-layer-list-item.styl';

interface Props {
  layer: LayerListItem;
  onRemove: () => void;
}

const SelectedLayerListItem: FunctionComponent<Props> = ({layer, onRemove}) => (
  <div className={styles.selectedLayerListItem}>
    <div className={styles.layerTitle}>
      <div className={styles.layerIcon}></div>
      <span className={styles.layerTitle}>{layer.shortName}</span>
    </div>
    {onRemove && (
      <button
        className={styles.removeIcon}
        onClick={() => {
          if (typeof onRemove === 'function') {
            onRemove();
          }
        }}>
        <RemoveIcon />
      </button>
    )}
  </div>
);

export default SelectedLayerListItem;
