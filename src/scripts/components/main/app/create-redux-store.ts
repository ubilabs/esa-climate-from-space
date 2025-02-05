import { AnyAction, Middleware } from "redux";
import { createLogger } from "redux-logger";
import { thunk, ThunkDispatch } from "redux-thunk";

import rootReducer from "../../../reducers/index";
import {
  isElectron,
  connectToStore,
  offlineSaveMiddleware,
  offlineLoadMiddleware,
} from "../../../libs/electron/index";

import { configureStore } from "@reduxjs/toolkit";

const isProduction = import.meta.env.PROD;
const middleware: Middleware[] = [thunk];

if (false) {
  middleware.push(offlineSaveMiddleware);
  middleware.push(offlineLoadMiddleware);
}

if (!isProduction) {
  middleware.push(createLogger({ collapsed: true }));
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(middleware);
  },
});

// connect electron messages to redux store
if (isElectron()) {
  connectToStore(store.dispatch);
}

export type RootState = ReturnType<typeof store.getState>;
export type AppThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;
