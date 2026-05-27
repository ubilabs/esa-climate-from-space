import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

const multiGlobeSyncSlice = createSlice({
  name: "multiGlobeSync",
  initialState,
  reducers: {
    toggleMultiGlobeSync(state) {
      return !state;
    },
  },
});

export const { toggleMultiGlobeSync } = multiGlobeSyncSlice.actions;
export default multiGlobeSyncSlice.reducer;
