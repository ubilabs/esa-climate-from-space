import React, {FunctionComponent} from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from '../../reducers/index';
import LayerSelector from '../layer-selector/layer-selector';

import styles from './app.styl';

const store = createStore(rootReducer, applyMiddleware(thunk, logger));

const App: FunctionComponent<{}> = () => (
  <Provider store={store}>
    <div className={styles.app}></div>
    <LayerSelector />
  </Provider>
);

export default App;
