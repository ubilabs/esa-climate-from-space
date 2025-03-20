import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CameraView } from "@ubilabs/esa-webgl-globe";
import config from "../config/main";

export interface FlyToPayload extends CameraView {
  isAnimated: boolean;
}
const initialState = null;
//  {
//  lat: config.globe.view.lat,
//  lng: config.globe.view.lng,
//  renderMode: config.globe.view.renderMode,
//  zoom: config.globe.view.zoom,
//  altitude: config.globe.view.altitude,
//  isAnimated: false,
//};

const flyToSlice = createSlice({
  name: "flyTo",
  initialState,
  reducers: {
    setFlyTo(state, action: PayloadAction<FlyToPayload>) {
      console.log("setFlyTo", action.payload);
      return action.payload;
    },
  },
});

export const { setFlyTo } = flyToSlice.actions;
export default flyToSlice.reducer;
