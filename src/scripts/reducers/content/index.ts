import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { parseContentUrl } from "../../libs/content-url-parameter";

interface StoriesState {
  category: string | null | undefined;
  contentId: string | null | undefined;
}

const initialState: StoriesState = {
  ...parseContentUrl(),
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setSelectedContentAction(
      state,
      action: PayloadAction<{
        contentId?: string | null;
        category?: string | null;
      }>,
    ) {
      state.contentId = action.payload.contentId;
      state.category = action.payload.category ?? state.category;
    },
  },
});

export const { setSelectedContentAction } = contentSlice.actions;

export default contentSlice.reducer;
export type { StoriesState };
