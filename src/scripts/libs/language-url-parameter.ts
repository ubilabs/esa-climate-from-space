import {Language} from '../types/language';
// parses window.location and reads the story tags from query params
// note: we do not use the location.search prop here because the HashRouter

// stores the query parameters in the location.hash prop
export function parseUrl(): Language | null {
  const {hash} = location;

  const queryString = hash.substr(hash.indexOf('?'));
  const urlParams = new URLSearchParams(queryString);
  const languageParam = urlParams.get('lng') as Language;

  if (languageParam && Object.values(Language).includes(languageParam)) {
    return languageParam;
  }

  return null;
}
