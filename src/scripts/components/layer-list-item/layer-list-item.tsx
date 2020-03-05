import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';

import {LayerListItem as LayerListItemType} from '../../types/layer-list';

import styles from './layer-list-item.styl';

interface Props {
  layer: LayerListItemType;
  isMainSelected: boolean;
  onSelect: (id: string, isMain: boolean) => void;
  onDownload: null | ((id: string) => void);
}

const LayerListItem: FunctionComponent<Props> = ({
  layer,
  isMainSelected,
  onSelect,
  onDownload
}) => (
  <div className={styles.layerItem} onClick={() => onSelect(layer.id, true)}>
    <span className={styles.layerTitle}>{layer.name}</span>
    {isMainSelected && (
      <button
        className={styles.compare}
        onClick={event => {
          onSelect(layer.id, false);
          event.stopPropagation();
        }}>
        <FormattedMessage id={'layerSelector.compare'} />
      </button>
    )}
    {onDownload && (
      <button onClick={() => onDownload(layer.id)}>Download</button>
    )}
  </div>
);

export default LayerListItem;
