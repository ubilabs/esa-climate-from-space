import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StoryLayerState {
  storyLayerId: string | null;
}

const initialState: StoryLayerState = {
  storyLayerId: null,
};

const storyLayerSlice = createSlice({
  name: "storyLayer",
  initialState,
  reducers: {
    setStoryLayer(state, action: PayloadAction<string | null>) {
      state.storyLayerId = action.payload;
    },
  },
});

export const { setStoryLayer } = storyLayerSlice.actions;
export default storyLayerSlice.reducer;
