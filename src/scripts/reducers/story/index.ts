import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StoriesState {
  storiesList: any[]; // Replace 'any' with your actual stories list type
  selected: string | null;
  selectedTags: string[];
}

const initialState: StoriesState = {
  storiesList: [
    {
      id: "story-32",
      title: "Bienvenue sur le site Climate from Space",
      description: "",
      image: "assets/atmospheric-ecvs.jpg",
      tags: [],
      position: [-60, -3],
    },
  ],
  selected: null,
  selectedTags: [],
};

const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    setStoriesList: (state, action: PayloadAction<any[]>) => {
      state.storiesList = action.payload;
    },
    setSelected: (state, action: PayloadAction<string | null>) => {
      state.selected = action.payload;
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload;
    },
  },
});

export const { setStoriesList, setSelected, setSelectedTags } =
  storiesSlice.actions;

export default storiesSlice.reducer;
export type { StoriesState };
