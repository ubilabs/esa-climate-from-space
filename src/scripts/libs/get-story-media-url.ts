import {
  isElectron,
  isOffline,
  getOfflineStoryMediaUrl
} from '../libs/electron/index';
import {replaceUrlPlaceholders} from '../libs/replace-url-placeholders';
import config from '../config/main';

export function getStoryMediaUrl(
  storyId: string,
  relativePath: string
): string {
  let baseUrl = replaceUrlPlaceholders(config.api.storyMediaBase, {
    id: storyId
  });

  if (isElectron() && isOffline()) {
    baseUrl = replaceUrlPlaceholders(getOfflineStoryMediaUrl(), {id: storyId});
  }

  return `${baseUrl}/${relativePath}`;
}
