// This is a redux middleware which saves and loads the response of the given
// fetch actions on the local file system for offline use.
import {Middleware, Dispatch, AnyAction} from 'redux';
import {
  FETCH_LAYERS_SUCCESS,
  FETCH_LAYERS_ERROR
} from '../../actions/fetch-layers';
import {
  FETCH_STORIES_SUCCESS,
  FETCH_STORIES_ERROR
} from '../../actions/fetch-stories';
import {
  FETCH_STORY_SUCCESS,
  FETCH_STORY_ERROR
} from '../../actions/fetch-story';
import {saveAction} from './save-action';
import {loadAction} from './load-action';

import {ActionToPersist} from '../../types/action-to-persist';

// These are the actions we want to save/load when in electron mode
const actionsToPersist: ActionToPersist[] = [
  {
    success: FETCH_LAYERS_SUCCESS,
    error: FETCH_LAYERS_ERROR,
    save: true,
    load: true
  },
  {
    success: FETCH_STORIES_SUCCESS,
    error: FETCH_STORIES_ERROR,
    save: true,
    load: true
  },
  {
    success: FETCH_STORY_SUCCESS,
    error: FETCH_STORY_ERROR,
    save: false, // for this action we only want to load the file from the story's offline package
    load: true,
    path: '/'
  }
];

// Saves the specified success actions as a json file on the file system
export const offlineSaveMiddleware: Middleware = () => (
  next: Dispatch<AnyAction>
) => (action: AnyAction) => {
  const actionToSave = actionsToPersist.find(
    ({success}) => success === action.type
  );

  if (actionToSave?.save) {
    saveAction(action);
  }

  return next(action);
};

// Tries to load persisted success actions in case their error counterpart was
// dispatched
export const offlineLoadMiddleware: Middleware = () => (
  next: Dispatch<AnyAction>
) => (action: AnyAction) => {
  const actionToSave = actionsToPersist.find(
    ({error}) => error === action.type
  );

  // when the incoming action did fail and is one we probably saved before,
  // try to load it from the filesystem and return the success action instead
  // of the error action
  if (actionToSave?.load) {
    const loadedAction = loadAction(actionToSave.success);

    if (loadedAction) {
      return next(loadedAction);
    }
  }

  // return the original error action when not found
  return next(action);
};
