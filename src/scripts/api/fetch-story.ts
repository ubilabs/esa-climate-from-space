import config from '../config/main';

import {Language} from '../types/language';

export default function fetchStory(id: string, language: Language) {
  const url = `${config.api.story}-${language.toLowerCase()}.json`;
  return fetch(url).then(res => res.json());
}
