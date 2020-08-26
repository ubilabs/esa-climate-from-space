import config from '../config/main';

import {Language} from '../types/language';

export default function getLocalStorageLanguage(): Language | null {
  const storedLanguage = localStorage.getItem(config.localStorageLanguage);
  const languages = Object.values(Language);

  const availableLanguage =
    storedLanguage &&
    languages.find(
      language =>
        language.substr(0, 2).toLowerCase() ===
        storedLanguage.substr(0, 2).toLowerCase()
    );

  return availableLanguage || null;
}
