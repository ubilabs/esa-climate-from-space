import { configureStore, Middleware, AnyAction } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { thunk, ThunkDispatch } from "redux-thunk";
import { layersApi, storiesApi } from "../../../services/api";

import rootReducer from "../../../reducers/index";
import {
  isElectron,
  connectToStore,
  offlineSaveMiddleware,
  offlineLoadMiddleware,
} from "../../../libs/electron/index";

const isProduction = import.meta.env.PROD;
const middleware: Middleware[] = [thunk];

if (isElectron()) {
  middleware.push(offlineSaveMiddleware);
  middleware.push(offlineLoadMiddleware);
}

if (!isProduction) {
  middleware.push(createLogger({ collapsed: true }));
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(middleware)
      .concat(layersApi.middleware)
      .concat(storiesApi.middleware);
  },
});

// connect electron messages to redux store
if (isElectron()) {
  connectToStore(store.dispatch);
}

export type RootState = ReturnType<typeof store.getState>;
export type AppThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;
