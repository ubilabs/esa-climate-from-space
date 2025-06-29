import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LayerLoadingState } from "@ubilabs/esa-webgl-globe";

export type LoadingStateByLayer = { [layerId: string]: LayerLoadingState };

interface UpdateLayerLoadingStatePayload {
  layerId: string;
  loadingState: LayerLoadingState;
}

const layerLoadingStateSlice = createSlice({
  name: "layerLoadingState",
  initialState: {} as LoadingStateByLayer,
  reducers: {
    updateLayerLoadingState: (
      state,
      action: PayloadAction<UpdateLayerLoadingStatePayload>,
    ) => {
      state[action.payload.layerId] = action.payload.loadingState;
    },
  },
});

export const { updateLayerLoadingState } = layerLoadingStateSlice.actions;
export default layerLoadingStateSlice.reducer;
