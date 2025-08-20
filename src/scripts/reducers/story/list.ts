import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StoryList } from "../../types/story-list";

const initialState: StoryList = [];

const storyListSlice = createSlice({
  name: "storyList",
  initialState,
  reducers: {
    fetchStoriesSuccess: (state, action: PayloadAction<StoryList>) => {
      state.push(...action.payload);
    }, },
});

export const { fetchStoriesSuccess } = storyListSlice.actions;

export default storyListSlice.reducer;
