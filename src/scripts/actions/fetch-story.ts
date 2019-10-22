import {Dispatch} from 'redux';

import fetchStoryApi from '../api/fetch-story';
import {languageSelector} from '../reducers/language';
import {State} from '../reducers/index';

import {Story} from '../types/story';

export const FETCH_STORY_SUCCESS = 'FETCH_STORY_SUCCESS';
export const FETCH_STORY_ERROR = 'FETCH_STORY_ERROR';

interface FetchStorySuccessAction {
  type: typeof FETCH_STORY_SUCCESS;
  story: Story;
}

interface FetchStoryErrorAction {
  type: typeof FETCH_STORY_ERROR;
  message: string;
}

export type FetchStoryActions = FetchStorySuccessAction | FetchStoryErrorAction;

function fetchStorySuccessAction(story: Story) {
  return {
    type: FETCH_STORY_SUCCESS,
    story
  };
}

function fetchStoryErrorAction(message: string) {
  return {
    type: FETCH_STORY_ERROR,
    message
  };
}

const fetchStory = (id: string) => (
  dispatch: Dispatch,
  getState: () => State
) => {
  const language = languageSelector(getState());

  return fetchStoryApi(id, language)
    .then(story => dispatch(fetchStorySuccessAction(story)))
    .catch(error => dispatch(fetchStoryErrorAction(error.message)));
};

export default fetchStory;
