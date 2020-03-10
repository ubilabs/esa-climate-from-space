import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';

// @ts-ignore
import {isElectron, downloadUrl} from 'electronHelpers'; // this is an webpack alias
import {replaceUrlPlaceholders} from '../../libs/replace-url-placeholders';
import config from '../../config/main';

import {LayerListItem as LayerListItemType} from '../../types/layer-list';

import styles from './layer-list-item.styl';

interface Props {
  layer: LayerListItemType;
  isMainSelected: boolean;
  isDownloaded: boolean;
  onSelect: (id: string, isMain: boolean) => void;
}

const LayerListItem: FunctionComponent<Props> = ({
  layer,
  isMainSelected,
  isDownloaded,
  onSelect
}) => {
  const onDownload = () =>
    isElectron() &&
    downloadUrl(
      replaceUrlPlaceholders(config.api.layerOfflinePackage, {id: layer.id})
    );

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
      {isElectron() && !isDownloaded && (
        <button onClick={onDownload}>Download</button>
      )}
      {isElectron() && isDownloaded && <button disabled>Ready</button>}
    </div>
  );
};

export default LayerListItem;
