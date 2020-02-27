import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';

import cx from 'classnames';
import {LayerListItem as LayerListItemType} from '../../types/layer-list';

import styles from './layer-list-item.styl';

interface Props {
  layer: LayerListItemType;
  isMainSelected?: string;
  onMainSelect: (id: string) => void;
  onCompareSelect: (id: string) => void;
}

const LayerListItem: FunctionComponent<Props> = ({
  layer,
  isMainSelected,
  onMainSelect,
  onCompareSelect
}) => {
  const layerItemClasses = cx(styles.layerItem);

  return (
    <div className={layerItemClasses}>
      <span
        className={styles.layerTitle}
        onClick={() => onMainSelect(layer.id)}>
        {layer.name}
      </span>
      {isMainSelected && (
        <span
          className={styles.compare}
          onClick={() => onCompareSelect(layer.id)}>
          <FormattedMessage id={'layerSelector.compare'} />
        </span>
      )}
    </div>
  );
};

export default LayerListItem;
