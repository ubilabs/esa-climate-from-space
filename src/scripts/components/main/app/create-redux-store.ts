import { configureStore, Middleware, AnyAction } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { ThunkDispatch } from "redux-thunk";
import { layersApi, storiesApi } from "../../../services/api";

import rootReducer from "../../../reducers/index";
import {
  isElectron,
  connectToStore,
  offlineSaveMiddleware,
  offlineLoadMiddleware,
} from "../../../libs/electron/index";

const isProduction = import.meta.env.PROD;
const middleware: Middleware[] = [];

if (isElectron()) {
  middleware.push(offlineSaveMiddleware);
  middleware.push(offlineLoadMiddleware);
}

if (!isProduction || isElectron()) {
  middleware.push(createLogger({ collapsed: true }));
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(storiesApi.middleware)
      .concat(layersApi.middleware)
      .concat(middleware);
  },
});

// connect electron messages to redux store
if (isElectron()) {
  connectToStore(store.dispatch);
}

export type RootState = ReturnType<typeof store.getState>;
export type AppThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;
