import {ThunkDispatch} from 'redux-thunk';

import {storyItemSelector} from '../reducers/story/item';
import fetchLayers, {FetchLayersActions} from './fetch-layers';
import fetchStories from './fetch-stories';
import fetchStory from './fetch-story';

import {State} from '../reducers/index';
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
  dispatch({
    type: SET_LANGUAGE,
    language
  });

  dispatch(fetchLayers());
  dispatch(fetchStories());

  const state = getState();
  const story = storyItemSelector(state);
  story && dispatch(fetchStory(story.id));
};

export default setLanguageAction;
