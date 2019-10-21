import config from '../config/main';
import {replaceUrlPlaceholders} from '../libs/replace-url-placeholders';

export default function fetchLayer(id: string) {
  const url = replaceUrlPlaceholders(config.api.layer, {id});
  return fetch(url).then(res => res.json());
}
