import config from '../config/main';

import {Language} from '../types/language';

export default function fetchLayers(language: Language) {
  const url = `${config.api.layers}-${language.toLowerCase()}.json`;
  return fetch(url).then(res => res.json());
}
