import { DownloadProgress } from "../types/download-progress";

export const SET_DOWNLOAD_PROGRESS = "SET_DOWNLOAD_PROGRESS";

export interface SetDownloadProgressAction {
  type: typeof SET_DOWNLOAD_PROGRESS;
  progress: DownloadProgress;
}

const setDownloadProgressAction = (
  progress: DownloadProgress,
): SetDownloadProgressAction => ({
  type: SET_DOWNLOAD_PROGRESS,
  progress,
});

export default setDownloadProgressAction;
