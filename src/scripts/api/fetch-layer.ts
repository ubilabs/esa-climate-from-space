import config from '../config/main';
import {replaceUrlPlaceholders} from '../libs/replace-url-placeholders';

const layerRequestCache = new Map<string, Promise<unknown>>();

export default function fetchLayer(id: string) {
  if (layerRequestCache.has(id)) {
    return layerRequestCache.get(id) as Promise<unknown>;
  }

  const url = replaceUrlPlaceholders(config.api.layer, {id});
  const request = fetch(url).then(res => res.json());

  layerRequestCache.set(id, request);

  return request;
}
