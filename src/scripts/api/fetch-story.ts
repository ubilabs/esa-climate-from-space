import config from "../config/main";

import { replaceUrlPlaceholders } from "../libs/replace-url-placeholders";

import { Language } from "../types/language";

export default function fetchStory(id: string, lang: Language) {
  const url = replaceUrlPlaceholders(config.api.story, { id, lang });
  return fetch(url).then((res) => res.json());
}
