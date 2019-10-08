import {Locale} from '../actions/set-locale';
import config from '../config/main';

export default function fetchLayers(locale: Locale) {
  const url = `${config.api.layers}-${locale.toLowerCase()}.json`;
  return fetch(url).then(res => res.json());
}
