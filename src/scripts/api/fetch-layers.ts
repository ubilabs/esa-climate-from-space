import config from '../config/main';
import {replaceUrlPlaceholders} from '../libs/replace-url-placeholders';

import {Language} from '../types/language';

export default function fetchLayers(language: Language) {
  const url = replaceUrlPlaceholders(config.api.layers, {
    lang: language.toLowerCase()
  });

  return fetch(url).then(res => res.json());
}
