import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StoriesState {
  selected: string | null;
  selectedTags: string[];
}

const initialState: StoriesState = {
  selected: null,
  selectedTags: [],
};

const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<string | null>) => {
      state.selected = action.payload;
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload;
    },
  },
});

export const { setSelected, setSelectedTags } = storiesSlice.actions;

export default storiesSlice.reducer;
export type { StoriesState };
