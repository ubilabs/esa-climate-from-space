import config from '../config/main';

import {replaceUrlPlaceholders} from '../libs/replace-url-placeholders';

import {Language} from '../types/language';

export default function fetchStories(lang: Language) {
  const url = replaceUrlPlaceholders(config.api.stories, {lang});
  return fetch(url).then(res => res.json());
}
