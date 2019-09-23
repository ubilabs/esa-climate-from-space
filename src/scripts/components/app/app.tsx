import React, {FunctionComponent} from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import logger from 'redux-logger';
import rootReducer from '../../reducers/index';
import Test from '../test/test';

import styles from './app.styl';

const store = createStore(rootReducer, applyMiddleware(logger));

const App: FunctionComponent<{}> = () => (
  <Provider store={store}>
    <h1 className={styles.app}>Hello</h1>
    <Test />
  </Provider>
);

export default App;
