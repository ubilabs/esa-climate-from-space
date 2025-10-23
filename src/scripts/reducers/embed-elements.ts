import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { parseUrl } from "../libs/embed-elements-url-parameter";
import { parseUrl as parseLngUrl } from "../libs/language-url-parameter";
import { EmbedElementsState } from "../types/embed-elements";

// We updated the params according to the new navigation and removed params which no longer make sense. We ensure backwards compactibility for the remaining params.
const initialState: EmbedElementsState = {
  logo: parseUrl("logo") ?? true,
  time_slider: parseUrl("time_slider") ?? true,
  layers_menu: parseUrl("layers_menu") ?? true,
  legend: parseUrl("legend") ?? true,
  header: parseUrl("header") ?? true,
  back_link: parseUrl("back_link") ?? true,
  app_menu: parseUrl("app_menu") ?? true,
  lng: parseLngUrl() ?? "",
};

const embedElementsSlice = createSlice({
  name: "embedElements",
  initialState,
  reducers: {
    toggleEmbedElements(state, action: PayloadAction<EmbedElementsState>) {
      return Object.assign(state, action.payload);
    },
  },
});

export const { toggleEmbedElements } = embedElementsSlice.actions;
export default embedElementsSlice.reducer;
