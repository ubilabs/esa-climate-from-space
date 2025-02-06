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
  FETCH_STORY_ERROR,
  fetchStorySuccessAction
} from '../../actions/fetch-story';
import {
  FETCH_LAYER_SUCCESS,
  FETCH_LAYER_ERROR,
  fetchLayerSuccessAction
} from '../../actions/fetch-layer';
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
    save: false, // for this action we only want to load the file from the stories' offline package
    load: true,
    getFilePath: (errorAction: AnyAction) =>
      `downloads/story-${errorAction.id}/${errorAction.id}-${errorAction.language}.json`, // the path relative to the app's offline folder
    successActionCreator: (errorAction, content) =>
      fetchStorySuccessAction(errorAction.id, errorAction.language, content)
  },
  {
    success: FETCH_LAYER_SUCCESS,
    error: FETCH_LAYER_ERROR,
    save: false, // for this action we only want to load the file from the layers's offline package
    load: true,
    getFilePath: (errorAction: AnyAction) =>
      `downloads/${errorAction.id}/metadata.json`, // the path relative to the app's offline folder
    successActionCreator: (errorAction, content) =>
      fetchLayerSuccessAction(errorAction.id, content)
  }
];

// Saves the specified success actions as a json file on the file system
export const offlineSaveMiddleware: Middleware =
  () => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
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
export const offlineLoadMiddleware: Middleware =
  () => (next: Dispatch<AnyAction>) => async (dispatchedAction: AnyAction) => {
    const actionToLoad = actionsToPersist.find(
      ({error}) => error === dispatchedAction.type
    );

    // when the incoming action did fail and is one we probably saved before,
    // try to load it from the filesystem and return the success action instead
    // of the error action
    if (actionToLoad?.load) {
      const filePath = actionToLoad.getFilePath
        ? actionToLoad.getFilePath(dispatchedAction)
        : undefined;
      const content = await loadAction(actionToLoad.success, filePath);

      // persisted data not found -> dispatch original error action
      if (!content) {
        return next(dispatchedAction);
      }

      // if we load the action directly the content is already the complete action
      // if we load content from a downloaded package we have to create the action
      // object first with the successActionCreator function
      const loadedAction = actionToLoad.successActionCreator
        ? actionToLoad.successActionCreator(dispatchedAction, content)
        : content;

      if (loadedAction) {
        return next(loadedAction);
      }
    }

    // return the original error action when not found
    return next(dispatchedAction);
  };
