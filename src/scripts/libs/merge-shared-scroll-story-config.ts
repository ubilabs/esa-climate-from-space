import { Story } from "../types/story";
import { SharedScrollStoryConfig } from "./shared-scroll-story-configs";

type MergeSharedScrollStoryConfigOptions = {
  story: Story;
  sharedConfig: SharedScrollStoryConfig;
};

export function mergeSharedScrollStoryConfig({
  story,
  sharedConfig,
}: MergeSharedScrollStoryConfigOptions): Story {

  const {
    splashscreen: sharedSplashscreen,
    modules: sharedModules = [],
    ...sharedStoryFields
  } = sharedConfig;

  if (sharedModules.length !== story.modules.length) {
    console.warn(
      `Shared ${story.id} config has ${sharedModules.length} modules, but story payload has ${story.modules.length}. Merging available indexes only.`,
    );
  }

  return {
    ...story,
    ...sharedStoryFields,
    splashscreen: {
      ...story.splashscreen,
      ...sharedSplashscreen,
    },
    modules: story.modules.map((module, index) => ({
      ...module,
      ...(sharedModules[index] ?? {}),
    })),
  };
}
