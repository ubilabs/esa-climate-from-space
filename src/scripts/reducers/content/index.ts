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
      if (action.payload.contentId !== undefined) {
        state.contentId = action.payload.contentId ?? state.contentId;
      }
      if (action.payload.category !== undefined) {
        state.category = action.payload.category ?? state.category;
      }
    },
  },
});

export const { setSelectedContentAction } = contentSlice.actions;

export default contentSlice.reducer;
export type { StoriesState };
