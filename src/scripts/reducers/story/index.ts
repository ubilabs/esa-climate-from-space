import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StoriesState {
  //   storiesList: Story[]; // Replace 'any' with your actual stories list type
  selected: string | null;
  selectedTags: string[];
}

const initialState: StoriesState = {
  //   storiesList: [],
  selected: null,
  selectedTags: [],
};

const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    // setStoriesList: (state, action: PayloadAction<Story[]>) => {
    //   state.storiesList = action.payload;
    // },
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
