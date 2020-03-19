import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';

import {isElectron, downloadUrl, deleteId} from '../../libs/electron/index';
import {downloadedDataSelector} from '../../selectors/offline/downloaded';
import {downloadProgressSelector} from '../../selectors/offline/progress';
import {DownloadIcon} from '../icons/download-icon';
import {DownloadCompleteIcon} from '../icons/download-complete-icon';
import Button from '../button/button';

import styles from './download-button.styl';

interface Props {
  id: string;
  url: string;
}

export const DownloadButton: FunctionComponent<Props> = ({url, id}) => {
  const downloadedData = useSelector(downloadedDataSelector);
  const downloadProgress = useSelector(downloadProgressSelector);
  const onDownload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    isElectron() && downloadUrl(url);
  };
  const isDownloading = typeof downloadProgress[url] === 'number';
  const progress = isDownloading ? Math.ceil(downloadProgress[url] * 100) : 0;
  const isDownloaded = [
    ...downloadedData.stories,
    ...downloadedData.layers
  ].includes(id);

  if (!isElectron()) {
    return null;
  }

  return (
    <div className={styles.downloadButton}>
      {!isDownloaded && !isDownloading && (
        <Button
          icon={DownloadIcon}
          onClick={onDownload}
          className={styles.notDownloaded}
        />
      )}
      {isDownloaded && (
        <Button
          className={styles.complete}
          icon={DownloadCompleteIcon}
          onClick={event => {
            event.stopPropagation();
            event.preventDefault();
            deleteId(id);
          }}
        />
      )}
      {isDownloading && (
        <svg
          className={styles.circle}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
          style={{strokeDashoffset: 100 - progress}}>
          <circle cx="20" cy="20" r="16" />
        </svg>
      )}
    </div>
  );
};
