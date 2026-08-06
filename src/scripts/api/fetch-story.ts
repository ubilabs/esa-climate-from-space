import config from "../config/main";
import sharedStoryEEIConfig from "../../../storage/stories/story-eei/story-eei-config.json";

import { mergeSharedScrollStoryConfig } from "../libs/merge-shared-scroll-story-config";
import { replaceUrlPlaceholders } from "../libs/replace-url-placeholders";

import { Language } from "../types/language";
import { GlobeKeyframe, Story, ScrollGlobe } from "../types/story";

type SharedStorySegmentConfig = {
  globeKeyframes?: GlobeKeyframe[];
  lengthFactor?: number;
};

type SharedStoryEEIConfig = {
  initialglobeConfig?: { mobile: ScrollGlobe; desktop: ScrollGlobe };
  splashscreen?: SharedStorySegmentConfig;
  modules?: SharedStorySegmentConfig[];
};

export default async function fetchStory(id: string, lang: Language) {
  const url = replaceUrlPlaceholders(config.api.story, { id, lang });
  const response = await fetch(url);
  const story = (await response.json()) as Story;

  return mergeSharedScrollStoryConfig({
    story,
    storyId: "story-eei",
    sharedConfig: sharedStoryEEIConfig as SharedStoryEEIConfig,
  });
}
