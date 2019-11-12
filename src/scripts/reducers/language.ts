import {SET_LANGUAGE, SetLanguageAction} from '../actions/set-language';
import getBrowserLanguage from '../libs/get-browser-language';

import {Language} from '../types/language';

const initialState: Language = getBrowserLanguage() || Language.EN;

function languageReducer(
  state: Language = initialState,
  action: SetLanguageAction
): Language {
  switch (action.type) {
    case SET_LANGUAGE:
      return action.language;
    default:
      return state;
  }
}

export default languageReducer;
