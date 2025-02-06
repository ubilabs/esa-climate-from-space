import config from "../config/main";

import { Language } from "../types/language";

export default function getLocalStorageLanguage(): Language | null {
  const storedLanguage = localStorage.getItem(config.localStorageLanguageKey);
  const languages = Object.values(Language);

  const availableLanguage =
    storedLanguage && languages.find((language) => language === storedLanguage);

  return availableLanguage || null;
}
