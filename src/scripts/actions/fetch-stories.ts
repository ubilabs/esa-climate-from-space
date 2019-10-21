import {Dispatch} from 'redux';

import fetchStoriesApi from '../api/fetch-stories';
import {languageSelector} from '../reducers/language';

import {State} from '../reducers/index';
import {StoriesItem} from '../types/stories-item';

export const FETCH_STORIES_SUCCESS = 'FETCH_STORIES_SUCCESS';
export const FETCH_STORIES_ERROR = 'FETCH_STORIES_ERROR';

interface FetchStoriesSuccessAction {
  type: typeof FETCH_STORIES_SUCCESS;
  stories: StoriesItem[];
}

interface FetchStoriesErrorAction {
  type: typeof FETCH_STORIES_ERROR;
  message: string;
}

export type FetchStoriesActions =
  | FetchStoriesSuccessAction
  | FetchStoriesErrorAction;

function fetchStoriesSuccessAction(stories: StoriesItem[]) {
  return {
    type: FETCH_STORIES_SUCCESS,
    stories
  };
}

function fetchStoriesErrorAction(message: string) {
  return {
    type: FETCH_STORIES_ERROR,
    message
  };
}

const fetchStories = () => (dispatch: Dispatch, getState: () => State) => {
  const language = languageSelector(getState());

  return fetchStoriesApi(language)
    .then(stories => dispatch(fetchStoriesSuccessAction(stories)))
    .catch(error => dispatch(fetchStoriesErrorAction(error.message)));
};

export default fetchStories;
