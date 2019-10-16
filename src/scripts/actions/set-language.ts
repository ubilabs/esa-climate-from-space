import {ThunkDispatch} from 'redux-thunk';

import fetchLayers, {FetchLayersActions} from './fetch-layers';

import {State} from '../reducers/index';
import {Language} from '../types/language';

export const SET_LANGUAGE = 'SET_LANGUAGE';

export interface SetLanguageAction {
  type: typeof SET_LANGUAGE;
  language: Language;
}

type AllThunkActions = SetLanguageAction | FetchLayersActions;

const setLanguageAction = (language: Language) => (
  dispatch: ThunkDispatch<State, void, AllThunkActions>
) => {
  dispatch({
    type: SET_LANGUAGE,
    language
  });

  dispatch(fetchLayers());
};

export default setLanguageAction;
