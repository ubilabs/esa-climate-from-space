import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AutoRotatingState = boolean;

const initialState = false;

const autoRotateSlice = createSlice({
  name: "autoRotate",
  initialState,
  reducers: {
    setIsAutoRotating(_state, action: PayloadAction<boolean>) {
      return action.payload;
    },
  },
});

export const { setIsAutoRotating } = autoRotateSlice.actions;
export default autoRotateSlice.reducer;
