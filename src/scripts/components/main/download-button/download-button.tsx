import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';

import {isElectron, downloadUrl, deleteId} from '../../../libs/electron/index';
import {downloadedDataSelector} from '../../../selectors/offline/downloaded';
import {downloadProgressSelector} from '../../../selectors/offline/progress';
import {DownloadIcon} from '../icons/download-icon';
import {DownloadCompleteIcon} from '../icons/download-complete-icon';
import {DeleteIcon} from '../icons/delete-icon';
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
        <div className={styles.delete}>
          <Button className={styles.complete} icon={DownloadCompleteIcon} />
          <Button
            className={styles.trash}
            icon={DeleteIcon}
            onClick={event => {
              event.stopPropagation();
              event.preventDefault();
              deleteId(id);
            }}
          />
        </div>
      )}
      {isDownloading && (
        <svg
          className={styles.circle}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40">
          <circle
            style={{strokeDashoffset: 0}}
            stroke="rgba(255, 255, 255, 0.1)"
            cx="20"
            cy="20"
            r="16"
          />
          <circle
            style={{strokeDashoffset: 100 - progress}}
            cx="20"
            cy="20"
            r="16"
          />
        </svg>
      )}
    </div>
  );
};
