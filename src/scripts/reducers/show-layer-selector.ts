import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShowLayerSelectorState {
  value: boolean;
}

const initialState: ShowLayerSelectorState = {
  value: false,
};

const showLayerSelectorSlice = createSlice({
  name: "showLayerSelector",
  initialState,
  reducers: {
    setShowLayer(state, action: PayloadAction<boolean>) {
      state.value = action.payload;
    },
  },
});

export const { setShowLayer } = showLayerSelectorSlice.actions;

export default showLayerSelectorSlice.reducer;
