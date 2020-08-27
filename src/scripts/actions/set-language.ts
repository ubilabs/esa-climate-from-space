import {ThunkDispatch} from 'redux-thunk';

import {unsafeSelectedStorySelector} from '../selectors/story/selected';
import fetchLayers, {FetchLayersActions} from './fetch-layers';
import fetchStories from './fetch-stories';
import fetchStory from './fetch-story';
import {State} from '../reducers/index';
import config from '../config/main';

import {Language} from '../types/language';

export const SET_LANGUAGE = 'SET_LANGUAGE';

export interface SetLanguageAction {
  type: typeof SET_LANGUAGE;
  language: Language;
}

type AllThunkActions = SetLanguageAction | FetchLayersActions;

const setLanguageAction = (language: Language) => (
  dispatch: ThunkDispatch<State, void, AllThunkActions>,
  getState: () => State
) => {
  localStorage.setItem(config.localStorageLanguageKey, language);

  dispatch({
    type: SET_LANGUAGE,
    language
  });

  dispatch(fetchLayers());
  dispatch(fetchStories());

  const state = getState();
  const story = unsafeSelectedStorySelector(state);
  story && dispatch(fetchStory(story.id));
};

export default setLanguageAction;
