import {createStore, applyMiddleware, Middleware} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';

import rootReducer from '../../../reducers/index';
import {
  isElectron,
  connectToStore,
  offlineSaveMiddleware,
  offlineLoadMiddleware
} from '../../../libs/electron/index';

export function createReduxStore() {
  // @ts-ignore - injected by webpack
  const isProduction = PRODUCTION; // eslint-disable-line no-undef
  const middlewares: Middleware[] = [thunk];

  if (isElectron()) {
    middlewares.push(offlineSaveMiddleware);
    middlewares.push(offlineLoadMiddleware);
  }

  if (!isProduction) {
    middlewares.push(createLogger({collapsed: true}));
  }

  const store = createStore(rootReducer, applyMiddleware(...middlewares));

  // connect electron messages to redux store
  if (isElectron()) {
    connectToStore(store.dispatch);
  }

  return store;
}
