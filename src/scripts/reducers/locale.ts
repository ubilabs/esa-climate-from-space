import {State} from './index';
import {SET_LOCALE, Locale, SetLocaleAction} from '../actions/set-locale';

const initialState: Locale = Locale.EN;

function localeReducer(
  localeState: Locale = initialState,
  action: SetLocaleAction
): Locale {
  switch (action.type) {
    case SET_LOCALE:
      return action.locale;
    default:
      return localeState;
  }
}

export function localeSelector(state: State): Locale {
  return state.locale;
}

export default localeReducer;
