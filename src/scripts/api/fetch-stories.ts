import config from '../config/main';

import {Language} from '../types/language';

export default function fetchStories(language: Language) {
  const url = `${config.api.stories}-${language.toLowerCase()}.json`;
  return fetch(url).then(res => res.json());
}
