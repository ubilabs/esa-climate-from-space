import {Language} from '../actions/set-language';
import config from '../config/main';

export default function fetchLayers(language: Language) {
  const url = `${config.api.layers}-${language.toLowerCase()}.json`;
  return fetch(url).then(res => res.json());
}
