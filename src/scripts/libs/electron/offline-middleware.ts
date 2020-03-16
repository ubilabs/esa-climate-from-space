// This is a redux middleware which saves the response of the given fetch
// actions on the local file system for offline use.
import {Middleware, Dispatch, AnyAction} from 'redux';
import {
  FETCH_LAYERS_SUCCESS,
  FETCH_LAYERS_ERROR
} from '../../actions/fetch-layers';
import {
  FETCH_STORIES_SUCCESS,
  FETCH_STORIES_ERROR
} from '../../actions/fetch-stories';
import {saveAction} from './index';

// These are the action payloads we want to save when in electron
const actionsToSave = [
  {
    success: FETCH_LAYERS_SUCCESS,
    error: FETCH_STORIES_SUCCESS
  },
  {
    success: FETCH_LAYERS_ERROR,
    error: FETCH_STORIES_ERROR
  }
];

// Saves the specified success actions as a json file on the file system
export const offlineSaveMiddleware: Middleware = () => (
  next: Dispatch<AnyAction>
) => (action: AnyAction) => {
  const actionToSave = actionsToSave.find(
    ({success}) => success === action.type
  );

  if (actionToSave) {
    saveAction(action);
  }

  return next(action);
};

// Tries to read the saved success actions in case their error counterpart was
// dispatched
export const offlineReadMiddleware: Middleware = () => (
  next: Dispatch<AnyAction>
) => (action: AnyAction) => {
  const actionToSave = actionsToSave.find(({error}) => error === action.type);

  // when the incoming action did fail it is one we probably did save before,
  // try to read it from the filesystem and return the success action instead
  // of the error action
  if (actionToSave) {
    const loadedAction = loadAction(actionToSave.success);
    if (loadedAction) {
      return next(loadedAction);
    }
  }

  // return the original error action when not found
  return next(action);
};
