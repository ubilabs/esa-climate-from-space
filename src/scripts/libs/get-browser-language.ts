import {Language} from '../types/language';

export default function getBrowserLanguage(): Language | null {
  const browserLanguage = window.navigator.language;
  const languages = Object.values(Language);

  const availableLanguage = languages.find(
    language =>
      language.substr(0, 2).toLowerCase() ===
      browserLanguage.substr(0, 2).toLowerCase()
  );

  return availableLanguage || null;
}
