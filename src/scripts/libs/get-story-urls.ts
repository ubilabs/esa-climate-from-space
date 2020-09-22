import {
  isElectron,
  isOffline,
  getOfflineStoryMediaUrl
} from './electron/index';
import {replaceUrlPlaceholders} from './replace-url-placeholders';
import config from '../config/main';

export function getStoryMediaUrl(
  storyId: string,
  relativePath: string
): string {
  return getAbsolutePath(storyId, relativePath);
}

export function getStoryLinkUrl(
  storyId: string,
  path: string
): string {
  if (path.startsWith('http')) {
    return path;
  }

  return getAbsolutePath(storyId, path);
}

function getAbsolutePath(
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
