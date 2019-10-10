import {Language} from '../actions/set-language';
import config from '../config/main';

export default function fetchStories(language: Language) {
  const url = `${config.api.stories}-${language.toLowerCase()}.json`;
  return fetch(url).then(res => res.json());
}
