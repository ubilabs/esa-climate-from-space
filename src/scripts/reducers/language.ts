import {State} from './index';
import {
  SET_LANGUAGE,
  Language,
  SetLanguageAction
} from '../actions/set-language';

const initialState: Language = Language.EN;

function languageReducer(
  languageState: Language = initialState,
  action: SetLanguageAction
): Language {
  switch (action.type) {
    case SET_LANGUAGE:
      return action.language;
    default:
      return languageState;
  }
}

export function languageSelector(state: State): Language {
  return state.language;
}

export default languageReducer;
