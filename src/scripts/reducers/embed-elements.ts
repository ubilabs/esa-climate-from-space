import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { parseUrl } from "../libs/embed-elements-url-parameter";
import { EmbedElementsState } from "../types/embed-elements";

const initialState: EmbedElementsState = {
  logo: parseUrl("logo") ?? true,
  stories_menu: parseUrl("stories_menu") ?? true,
  layers_menu: parseUrl("layers_menu") ?? true,
  share_button: parseUrl("share_button") ?? true,
  app_menu: parseUrl("app_menu") ?? true,
  globe_navigation: parseUrl("globe_navigation") ?? true,
  markers: parseUrl("markers") ?? true,
  time_slider: parseUrl("time_slider") ?? true,
  legend: parseUrl("legend") ?? true,
  header: parseUrl("header") ?? true,
  back_link: parseUrl("back_link") ?? true,
  filter_tags: parseUrl("filter_tags") ?? true,
  story_header: parseUrl("story_header") ?? true,
  story_back_link: parseUrl("story_back_link") ?? true,
};

const embedElementsSlice = createSlice({
  name: "embedElements",
  initialState,
  reducers: {
    toggleEmbedElements(state, action: PayloadAction<EmbedElementsState>) {
      return action.payload;
    },
  },
});

export const { toggleEmbedElements } = embedElementsSlice.actions;
export default embedElementsSlice.reducer;
