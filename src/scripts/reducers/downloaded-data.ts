import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DownloadedData } from "../types/downloaded-data";

const initialState: DownloadedData = {
  layers: [],
  stories: [],
};

const downloadedDataSlice = createSlice({
  name: "downloadedData",
  initialState,
  reducers: {
    setDownloadedData(_state, action: PayloadAction<DownloadedData>) {
      return action.payload;
    },
  },
});

export const { setDownloadedData } = downloadedDataSlice.actions;
export default downloadedDataSlice.reducer;
