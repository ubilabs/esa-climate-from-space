import {State} from '../reducers/index';

import {Language} from '../types/language';

export function languageSelector(state: State): Language {
  return state.language;
}
