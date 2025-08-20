import {
  isElectron,
  isOffline,
  getOfflineStoryMediaUrl,
} from "./electron/index";
import { replaceUrlPlaceholders } from "./replace-url-placeholders";
import config from "../config/main";

export function getStoryAssetUrl(
  storyId: string,
  path: string | undefined,
): string {
  if (!path || path.length === 0) {
    return "";
  }
  if (path.startsWith("http")) {
    return path;
  }

  if (path.startsWith("stories")) {
    return `#${path}`;
  }

  let baseUrl = replaceUrlPlaceholders(config.api.storyMediaBase, {
    id: storyId,
  });

  if (isElectron() && isOffline()) {
    baseUrl = replaceUrlPlaceholders(getOfflineStoryMediaUrl(), {
      id: storyId,
    });
  }

  return `${baseUrl}/${path}`;
}
