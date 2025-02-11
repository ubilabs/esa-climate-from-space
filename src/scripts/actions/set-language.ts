import { useThunkDispatch } from "../hooks/use-thunk-dispatch";

import { unsafeSelectedStorySelector } from "../selectors/story/selected";
// import fetchlayers from "./fetch-layers";
// import fetchstories from "./fetch-stories";
// import fetchstory from "./fetch-story";
import { State } from "../reducers/index";
import config from "../config/main";

import { Language } from "../types/language";
import { setLanguage } from "../reducers/language";

export const SET_LANGUAGE = "SET_LANGUAGE";

export interface SetLanguageAction {
  type: typeof SET_LANGUAGE;
  language: Language;
}

const setLanguageAction =
  (language: Language) =>
  (dispatch: ReturnType<typeof useThunkDispatch>, getState: () => State) => {
    localStorage.setItem(config.localStorageLanguageKey, language);

    dispatch(setLanguage(language));

    // dispatch(fetchLayers());
    // dispatch(fetchStories());

    const state = getState();
    const story = unsafeSelectedStorySelector(state);
    if (story) {
      //   dispatch(fetchStory(story.id));
    }
  };

export default setLanguageAction;
