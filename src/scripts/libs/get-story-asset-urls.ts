import {
  isElectron,
  isOffline,
  getOfflineStoryMediaUrl,
} from "./electron/index";
import { replaceUrlPlaceholders } from "./replace-url-placeholders";
import config from "../config/main";

export interface StoryAssetUrlOptions {
  source?: "auto" | "cloud";
}

/**
 * Resolves a story-relative asset path for the current environment.
 * Use `source: "cloud"` for assets that must always load from the versioned
 * GCP story bucket, including during local development.
 */
export function getStoryAssetUrl(
  storyId: string,
  path: string | undefined,
  options: StoryAssetUrlOptions = {},
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

  const source = options.source ?? "auto";
  const baseUrlTemplate =
    source === "cloud"
      ? config.api.storyCloudMediaBase
      : config.api.storyMediaBase;
  let baseUrl = replaceUrlPlaceholders(baseUrlTemplate, {
    id: storyId,
  });

  if (source === "auto" && isElectron() && isOffline()) {
    baseUrl = replaceUrlPlaceholders(getOfflineStoryMediaUrl(), {
      id: storyId,
    });
  }

  return `${baseUrl}/${path}`;
}
