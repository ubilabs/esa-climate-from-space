import {Middleware, AnyAction} from 'redux';
import {createLogger} from 'redux-logger';
import thunk, {ThunkDispatch as ThunkDispatchInternal} from 'redux-thunk';

import rootReducer from '../../../reducers/index';
import {
  isElectron,
  connectToStore,
  offlineSaveMiddleware,
  offlineLoadMiddleware
} from '../../../libs/electron/index';

import {configureStore} from '@reduxjs/toolkit';

// @ts-ignore - injected by webpack
const isProduction = import.meta.env.PROD; // eslint-disable-line no-undef
const middleware: Middleware[] = [thunk];

if (isElectron()) {
  middleware.push(offlineSaveMiddleware);
  middleware.push(offlineLoadMiddleware);
}

if (!isProduction) {
  middleware.push(createLogger({collapsed: true}));
}

export const store = configureStore({
  reducer: rootReducer,
  middleware
});

// connect electron messages to redux store
if (isElectron()) {
  connectToStore(store.dispatch);
}

export type RootState = ReturnType<typeof store.getState>;
export type ThunkDispatch = ThunkDispatchInternal<RootState, void, AnyAction>;
