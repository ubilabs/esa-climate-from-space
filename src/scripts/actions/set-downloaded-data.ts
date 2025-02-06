import { DownloadedData } from "../types/downloaded-data";

export const SET_DOWNLOADED_DATA = "SET_DOWNLOADED_DATA";

export interface SetDownloadedDataAction {
  type: typeof SET_DOWNLOADED_DATA;
  data: DownloadedData;
}

const setDownloadedDataAction = (
  data: DownloadedData,
): SetDownloadedDataAction => ({
  type: SET_DOWNLOADED_DATA,
  data,
});

export default setDownloadedDataAction;
