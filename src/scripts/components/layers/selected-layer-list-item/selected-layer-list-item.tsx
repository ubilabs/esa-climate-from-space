import React, {FunctionComponent} from 'react';

import {RemoveIcon} from '../../main/icons/remove-icon';
import {replaceUrlPlaceholders} from '../../../libs/replace-url-placeholders';
import config from '../../../config/main';

import {LayerListItem} from '../../../types/layer-list';

import styles from './selected-layer-list-item.styl';

interface Props {
  layer: LayerListItem;
  onRemove: () => void;
}

const SelectedLayerListItem: FunctionComponent<Props> = ({layer, onRemove}) => {
  const layerId = layer.id;
  const layerIconUrl = replaceUrlPlaceholders(config.api.layericon, {layerId});

  return (
    <div className={styles.selectedLayerListItem}>
      <div className={styles.layer}>
        <img src={layerIconUrl} className={styles.layerIcon} />
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
};

export default SelectedLayerListItem;
