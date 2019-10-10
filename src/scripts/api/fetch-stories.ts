import {Locale} from '../actions/set-locale';
import config from '../config/main';

export default function fetchStories(locale: Locale) {
  const url = `${config.api.stories}-${locale.toLowerCase()}.json`;
  return fetch(url).then(res => res.json());
}
