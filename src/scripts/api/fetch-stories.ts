import config from "../config/main";

import { replaceUrlPlaceholders } from "../libs/replace-url-placeholders";

import { Language } from "../types/language";

export default async function fetchStories(lang: Language) {
  const url = replaceUrlPlaceholders(config.api.stories, { lang });
  const response = await fetch(url);
  return await response.json();
}
