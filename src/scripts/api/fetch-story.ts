import config from "../config/main";

import { mergeSharedScrollStoryConfig } from "../libs/merge-shared-scroll-story-config";
import { replaceUrlPlaceholders } from "../libs/replace-url-placeholders";
import {
  SharedScrollStoryConfig,
  sharedScrollStoryIds,
} from "../libs/shared-scroll-story-configs";

import { Language } from "../types/language";
import { Story } from "../types/story";

async function fetchSharedScrollStoryConfig(id: string) {
  if (!sharedScrollStoryIds.has(id)) {
    return null;
  }

  const url = replaceUrlPlaceholders(config.api.storySharedConfig, { id });
  const response = await fetch(url);

  if (!response.ok) {
    console.warn(
      `Could not load shared scroll story config for ${id}: ${response.status} ${response.statusText}`,
    );
    return null;
  }

  return (await response.json()) as SharedScrollStoryConfig;
}

export default async function fetchStory(id: string, lang: Language) {
  const url = replaceUrlPlaceholders(config.api.story, { id, lang });

  const [response, sharedConfig] = await Promise.all([
    fetch(url),
    fetchSharedScrollStoryConfig(id),
  ]);

  const story = (await response.json()) as Story;

  // scroll stories have a common config file while maintaining a file per language
  // we want to merge this so the story has the expected shape
  if (sharedConfig) {
    return mergeSharedScrollStoryConfig({
      story,
      storyId: story.id,
      sharedConfig,
    });
  }

  return story;
}
