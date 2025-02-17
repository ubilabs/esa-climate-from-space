import config from "../config/main";
import { replaceUrlPlaceholders } from "../libs/replace-url-placeholders";
import { Language } from "../types/language";

export async function fetchLayers(language: Language) {
  const url = replaceUrlPlaceholders(config.api.layers, {
    lang: language.toLowerCase(),
  });

  const response = await fetch(url);
  return await response.json();
}
