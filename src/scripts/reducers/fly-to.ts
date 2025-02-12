import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CameraView } from "@ubilabs/esa-webgl-globe";

interface FlyToState {
  view: CameraView | null;
}

const initialState: FlyToState = {
  view: null,
};

const flyToSlice = createSlice({
  name: "flyTo",
  initialState,
  reducers: {
    setFlyTo(state, action: PayloadAction<CameraView>) {
      state.view = action.payload;
    },
  },
});

export const { setFlyTo } = flyToSlice.actions;
export default flyToSlice.reducer;
