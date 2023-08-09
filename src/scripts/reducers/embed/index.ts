import {combineReducers} from 'redux';

import appElementsReducer from './app-elements';

const embedReducer = combineReducers({
  appElements: appElementsReducer
});

export default embedReducer;

export type EmbedState = ReturnType<typeof embedReducer>;
