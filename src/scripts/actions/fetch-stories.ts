import {ThunkDispatch} from '../components/main/app/create-redux-store';
import fetchStoriesApi from '../api/fetch-stories';
import {languageSelector} from '../selectors/language';

import {State} from '../reducers/index';
import {StoryList} from '../types/story-list';

export const FETCH_STORIES_SUCCESS = 'FETCH_STORIES_SUCCESS';
export const FETCH_STORIES_ERROR = 'FETCH_STORIES_ERROR';

interface FetchStoriesSuccessAction {
  type: typeof FETCH_STORIES_SUCCESS;
  stories: StoryList;
}

interface FetchStoriesErrorAction {
  type: typeof FETCH_STORIES_ERROR;
  message: string;
}

export type FetchStoriesActions =
  | FetchStoriesSuccessAction
  | FetchStoriesErrorAction;

function fetchStoriesSuccessAction(
  stories: StoryList
): FetchStoriesSuccessAction {
  return {
    type: FETCH_STORIES_SUCCESS,
    stories
  };
}

function fetchStoriesErrorAction(message: string): FetchStoriesErrorAction {
  return {
    type: FETCH_STORIES_ERROR,
    message
  };
}

const fetchStories = () => (dispatch: ThunkDispatch, getState: () => State) => {
  const language = languageSelector(getState());

  return fetchStoriesApi(language)
    .then(stories => dispatch(fetchStoriesSuccessAction(stories)))
    .catch(error => dispatch(fetchStoriesErrorAction(error.message)));
};

export default fetchStories;
