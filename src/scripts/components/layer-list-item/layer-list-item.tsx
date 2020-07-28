import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';

import {replaceUrlPlaceholders} from '../../libs/replace-url-placeholders';
import config from '../../config/main';
import {DownloadButton} from '../download-button/download-button';

import {LayerListItem as LayerListItemType} from '../../types/layer-list';
import {GlobeView} from '../../types/globe-view';

import styles from './layer-list-item.styl';

interface Props {
  layer: LayerListItemType;
  isMainSelected: boolean;
  onSelect: (id: string, flyTo: GlobeView, isMain: boolean) => void;
}

const LayerListItem: FunctionComponent<Props> = ({
  layer,
  isMainSelected,
  onSelect
}) => {
  const packageUrl = config.api.layerOfflinePackage;
  const offlineUrl = replaceUrlPlaceholders(packageUrl, {id: layer.id});

  return (
    <div
      className={styles.layerItem}
      onClick={() => onSelect(layer.id, layer.flyTo, true)}>
      <span className={styles.layerTitle}>{layer.name}</span>
      {isMainSelected && (
        <button
          className={styles.compare}
          onClick={event => {
            onSelect(layer.id, layer.flyTo, false);
            event.stopPropagation();
          }}>
          <FormattedMessage id={'layerSelector.compare'} />
        </button>
      )}

      <DownloadButton url={offlineUrl} id={layer.id} />
    </div>
  );
};

export default LayerListItem;
