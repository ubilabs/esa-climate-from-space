import {ThunkDispatch} from 'redux-thunk';

import {State} from '../reducers/index';
import fetchLayers, {FetchLayersActions} from './fetch-layers';

export const SET_LOCALE = 'SET_LOCALE';

export enum Locale {
  EN = 'en',
  DE = 'de'
}

export interface SetLocaleAction {
  type: typeof SET_LOCALE;
  locale: Locale;
}

type AllThunkActions = SetLocaleAction | FetchLayersActions;

const setLocaleAction = (locale: Locale) => (
  dispatch: ThunkDispatch<State, void, AllThunkActions>
) => {
  dispatch({
    type: SET_LOCALE,
    locale
  });

  dispatch(fetchLayers());
};

export default setLocaleAction;
