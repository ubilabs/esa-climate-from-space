import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';

import {isElectron, downloadUrl, deleteId} from '../../libs/electron/index';
import {downloadedDataSelector} from '../../selectors/offline/downloaded';
import {downloadProgressSelector} from '../../selectors/offline/progress';

interface Props {
  url: string;
  id: string;
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
    <div>
      {!isDownloaded && <button onClick={onDownload}>Download</button>}
      {isDownloaded && (
        <button
          onClick={event => {
            event.stopPropagation();
            event.preventDefault();
            deleteId(id);
          }}>
          Delete
        </button>
      )}
      {isDownloading && <span>{progress}</span>}
    </div>
  );
};
