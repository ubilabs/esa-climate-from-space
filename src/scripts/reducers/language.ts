import {SET_LANGUAGE, SetLanguageAction} from '../actions/set-language';
import getBrowserLanguage from '../libs/get-browser-language';
import getLocalStorageLanguage from '../libs/get-local-storage-language';

import {Language} from '../types/language';

const initialState: Language =
  getLocalStorageLanguage() || getBrowserLanguage() || Language.EN;

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
