import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';

// @ts-ignore
import {isElectron, downloadUrl} from 'electronHelpers'; // this is an webpack alias
import {replaceUrlPlaceholders} from '../../libs/replace-url-placeholders';
import config from '../../config/main';

import {LayerListItem as LayerListItemType} from '../../types/layer-list';
import {DownloadProgress} from '../../types/download-progress';

import styles from './layer-list-item.styl';

interface Props {
  layer: LayerListItemType;
  isMainSelected: boolean;
  isDownloaded: boolean;
  downloadProgress: DownloadProgress;
  onSelect: (id: string, isMain: boolean) => void;
}

const LayerListItem: FunctionComponent<Props> = ({
  layer,
  isMainSelected,
  isDownloaded,
  downloadProgress,
  onSelect
}) => {
  const packageUrl = config.api.layerOfflinePackage;
  const offlineUrl = replaceUrlPlaceholders(packageUrl, {id: layer.id});
  const onDownload = () => isElectron() && downloadUrl(offlineUrl);
  const progress = downloadProgress[offlineUrl];

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

      {isElectron() && typeof progress === 'number' && (
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

      {isElectron() && isDownloaded && <button disabled>Ready</button>}
    </div>
  );
};

export default LayerListItem;
