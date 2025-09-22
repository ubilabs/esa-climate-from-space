// This is a redux middleware which saves and loads the response of the given
// fetch actions on the local file system for offline use.
import { Middleware } from "@reduxjs/toolkit";
import { saveAction } from "./save-action";
import { loadAction } from "./load-action";

import { ActionToPersist, RTKQueryAction } from "../../types/action-to-persist";
import { layersApi, storiesApi } from "../../services/api";
import { setLayerDetails } from "../../reducers/layers";
import { Layer } from "../../types/layer";

// These are the actions we want to save/load when in electron mode
const actionsToPersist: ActionToPersist[] = [
  {
    meta: {
      arg: {
        endpointName: "getLayerList",
      },
    },
    save: true,
    load: true,
    payload: undefined,
  },
  {
    meta: {
      arg: {
        endpointName: "getStoryList",
      },
    },
    save: true,
    load: true,
    payload: undefined,
  },
  {
    meta: {
      arg: {
        endpointName: "getStory",
      },
    },
    save: false, // for this action we only want to load the file from the stories' offline package
    load: true,
    payload: undefined,
    getFilePath: (errorAction: RTKQueryAction) =>
      `downloads/${errorAction.meta?.arg.originalArgs.id}/${errorAction.meta?.arg.originalArgs.id}-${errorAction.meta?.arg.originalArgs.language}.json`, // the path relative to the app's offline folder
  },
  {
    meta: {
      arg: {
        endpointName: "getLayer",
      },
    },
    save: false, // for this action we only want to load the file from the layers's offline package
    load: true,
    payload: undefined,
    getFilePath: (errorAction: RTKQueryAction) =>
      `downloads/${errorAction.meta?.arg.originalArgs}/metadata.json`, // the path relative to the app's offline folder
  },
];

// Saves the specified success actions as a json file on the file system
export const offlineSaveMiddleware: Middleware = () => (next) => (action) => {
  const dispatchedAction = action as RTKQueryAction;

  const actionToSave = actionsToPersist.find(
    ({ meta }) =>
      meta.arg.endpointName === dispatchedAction.meta?.arg?.endpointName,
  );

  if (
    dispatchedAction.meta?.requestStatus === "fulfilled" &&
    actionToSave?.save
  ) {
    saveAction(dispatchedAction);
  }

  return next(action);
};

// Tries to load persisted success actions in case their error counterpart was
// dispatched
export const offlineLoadMiddleware: Middleware =
  (storeApi) => (next) => async (action) => {
    const dispatchedAction = action as RTKQueryAction;
    const fetchArgs = dispatchedAction.meta?.arg;

    const actionToLoad = actionsToPersist.find(
      ({ meta }) => meta.arg.endpointName === fetchArgs?.endpointName,
    );

    // when the incoming action did fail and is one we probably saved before,
    // try to load it from the filesystem and return the success action instead
    // of the error action
    if (actionToLoad?.load) {
      const filePath = actionToLoad.getFilePath
        ? actionToLoad.getFilePath(dispatchedAction)
        : undefined;
      const loadedAction = await loadAction(
        actionToLoad.meta.arg.endpointName,
        filePath,
      );

      // persisted data not found -> dispatch original error action
      if (!loadedAction) {
        return next(action);
      }

      if (loadedAction) {
        const content =
          "payload" in loadedAction ? loadedAction.payload : loadedAction;
        if (
          storiesApi.endpoints.getStoryList.matchRejected(action) ||
          storiesApi.endpoints.getStories.matchRejected(action) ||
          storiesApi.endpoints.getLegacyStory.matchRejected(action)
        ) {
          storeApi.dispatch(
            // @ts-expect-error Argument of type 'ThunkAction<InfiniteQueryActionCreatorResult<any> | QueryActionCreatorResult<any> | QueryActionCreatorResult<never>, RootState<...>, any, UnknownAction>' is not assignable to parameter of type 'UnknownAction'
            storiesApi.util.upsertQueryData(
              fetchArgs?.endpointName as keyof typeof storiesApi.endpoints,
              // @ts-expect-error Argument of type 'unknown' is not assignable to parameter of type 'Language | { id: string; language: string; } | { ids: string[]; language: string; }'
              fetchArgs?.originalArgs,
              content,
            ),
          );
          return;
        } else if (layersApi.endpoints.getLayerList.matchRejected(action)) {
          storeApi.dispatch(
            // @ts-expect-error Argument of type 'ThunkAction<InfiniteQueryActionCreatorResult<any> | QueryActionCreatorResult<any> | QueryActionCreatorResult<never>, RootState<...>, any, UnknownAction>' is not assignable to parameter of type 'UnknownAction'
            layersApi.util.upsertQueryData(
              fetchArgs?.endpointName as keyof typeof layersApi.endpoints,
              // @ts-expect-error Argument of type 'unknown' is not assignable to parameter of type 'string'
              fetchArgs?.originalArgs,
              content,
            ),
          );
          return;
        } else if (layersApi.endpoints.getLayer.matchRejected(action)) {
          storeApi.dispatch(setLayerDetails(content as Layer));
        }
      }
    }

    // return the original error action when not found
    return next(action);
  };
