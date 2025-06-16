import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { parseContentUrl } from "../../libs/content-url-parameter";

interface StoriesState {
  category: string | null;
  contentId: string | null;
}

const initialState: StoriesState = {
  ...parseContentUrl(),
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setSelectedContentAction: (
      state,
      action: PayloadAction<{
        contentId?: string | null;
        category?: string | null;
      }>,
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
},
});

export const { setSelectedContentAction } = contentSlice.actions;

export default contentSlice.reducer;
export type { StoriesState };
