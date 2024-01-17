import {Dispatch} from 'redux';

import fetchStoryApi from '../api/fetch-story';
import {languageSelector} from '../selectors/language';
import {State} from '../reducers/index';

import {LegacyStory} from '../types/legacy-story';

export const FETCH_STORY_SUCCESS = 'FETCH_STORY_SUCCESS';
export const FETCH_STORY_ERROR = 'FETCH_STORY_ERROR';

interface FetchStorySuccessAction {
  type: typeof FETCH_STORY_SUCCESS;
  id: string;
  language: string;
  story: LegacyStory;
}

interface FetchStoryErrorAction {
  type: typeof FETCH_STORY_ERROR;
  id: string;
  message: string;
}

export type FetchStoryActions = FetchStorySuccessAction | FetchStoryErrorAction;

export function fetchStorySuccessAction(
  storyId: string,
  language: string,
  story: LegacyStory
) {
  return {
    type: FETCH_STORY_SUCCESS,
    id: storyId,
    language,
    story
  };
}

function fetchStoryErrorAction(
  storyId: string,
  language: string,
  message: string
) {
  return {
    type: FETCH_STORY_ERROR,
    id: storyId,
    language,
    message
  };
}

const fetchStory = (id: string) => (
  dispatch: Dispatch,
  getState: () => State
) => {
  const language = languageSelector(getState());

  return fetchStoryApi(id, language)
    .then(story => dispatch(fetchStorySuccessAction(id, language, story)))
    .catch(error =>
      dispatch(fetchStoryErrorAction(id, language, error.message))
    );
};

export default fetchStory;
