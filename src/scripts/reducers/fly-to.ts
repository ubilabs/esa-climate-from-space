import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CameraView } from "@ubilabs/esa-webgl-globe";

interface FlyToState {
  view: CameraView | null;
  isAnimated?: boolean;
}
export interface FlyToPayload extends CameraView {
  isAnimated?: boolean;
}
const initialState: FlyToState = {
  view: null,
  isAnimated: false,
};

const flyToSlice = createSlice({
  name: "flyTo",
  initialState,
  reducers: {
    setFlyTo(state, action: PayloadAction<FlyToPayload>) {
      state.view = {
        ...state.view,
        ...action.payload,
      };
      state.isAnimated = action.payload.isAnimated;
    },
  },
});

export const { setFlyTo } = flyToSlice.actions;
export default flyToSlice.reducer;
