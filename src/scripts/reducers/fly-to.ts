import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CameraView } from "@ubilabs/esa-webgl-globe";

export interface FlyToPayload extends CameraView {
  isAnimated: boolean;
}
const initialState = null;

const flyToSlice = createSlice({
  name: "flyTo",
  initialState,
  reducers: {
    setFlyTo(state, action: PayloadAction<FlyToPayload>) {
      return action.payload;
    },
  },
});


export const { setFlyTo } = flyToSlice.actions;
export default flyToSlice.reducer;
