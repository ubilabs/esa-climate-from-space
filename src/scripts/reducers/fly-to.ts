import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CameraView } from "@ubilabs/esa-webgl-globe";

export interface FlyToPayload extends CameraView {
  isAnimated: boolean;
}
// If we pass empty object, the app will stop working. Fix
const initialState = null as unknown as FlyToPayload;

const flyToSlice = createSlice({
  name: "flyTo",
  initialState,
  reducers: {
    setFlyTo(_state, action: PayloadAction<FlyToPayload>) {
      return action.payload;
    },
  },
});

export const { setFlyTo } = flyToSlice.actions;
export default flyToSlice.reducer;
