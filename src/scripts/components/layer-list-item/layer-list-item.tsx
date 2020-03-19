import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';

import {replaceUrlPlaceholders} from '../../libs/replace-url-placeholders';
import config from '../../config/main';

import {LayerListItem as LayerListItemType} from '../../types/layer-list';
import {DownloadButton} from '../download-button/download-button';

import styles from './layer-list-item.styl';

interface Props {
  layer: LayerListItemType;
  isMainSelected: boolean;
  onSelect: (id: string, isMain: boolean) => void;
}

const LayerListItem: FunctionComponent<Props> = ({
  layer,
  isMainSelected,
  onSelect
}) => {
  const packageUrl = config.api.layerOfflinePackage;
  const offlineUrl = replaceUrlPlaceholders(packageUrl, {id: layer.id});

  return (
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

      <DownloadButton url={offlineUrl} id={layer.id} />
      {/* {isElectron() && typeof progress === 'number' && (
        <span>{Math.ceil(progress * 100)}</span>
      )}

      {isElectron() && !isDownloaded && (
        <button
          onClick={event => {
            event.stopPropagation();
            onDownload();
          }}>
          Download
        </button>
      )}

      {isElectron() && isDownloaded && (
        <button
          onClick={event => {
            event.stopPropagation();
            deleteId(layer.id);
          }}>
          Delete
        </button>
      )} */}
    </div>
  );
};

export default LayerListItem;
