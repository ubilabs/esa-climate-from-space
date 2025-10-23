import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DownloadProgress } from "../../types/download-progress";

const initialState: DownloadProgress = {};

const downloadProgressSlice = createSlice({
  name: "downloadProgress",
  initialState,
  reducers: {
    setDownloadProgress(_state, action: PayloadAction<DownloadProgress>) {
      return action.payload;
    },
  },
});

export const { setDownloadProgress } = downloadProgressSlice.actions;
export default downloadProgressSlice.reducer;
