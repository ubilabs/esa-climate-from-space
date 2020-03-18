import React, {FunctionComponent} from 'react';
import {isElectron, downloadUrl, deleteId} from '../../libs/electron/index';

interface Props {
  url: string;
  id: string;
}

export const DownloadButton: FunctionComponent<Props> = ({url, id}) => {
  const onDownload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    isElectron() && downloadUrl(url);
  };

  if (!isElectron()) {
    return null;
  }

  return (
    <div>
      <button onClick={onDownload}>Download</button>
      <button
        onClick={event => {
          event.stopPropagation();
          event.preventDefault();
          deleteId(id);
        }}>
        Delete
      </button>
    </div>
  );
};
