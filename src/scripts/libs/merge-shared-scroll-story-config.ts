import { Story } from "../types/story";

type SharedScrollStorySegmentConfig = Record<string, unknown>;

type SharedScrollStoryConfig<
  TSharedSegmentConfig extends SharedScrollStorySegmentConfig,
  TSharedStoryConfig extends Record<string, unknown> = Record<string, never>,
> = TSharedStoryConfig & {
  splashscreen?: TSharedSegmentConfig;
  modules?: TSharedSegmentConfig[];
};

type MergeSharedScrollStoryConfigOptions<
  TSharedSegmentConfig extends SharedScrollStorySegmentConfig,
  TSharedStoryConfig extends Record<string, unknown> = Record<string, never>,
> = {
  story: Story;
  storyId: string;
  sharedConfig: SharedScrollStoryConfig<
    TSharedSegmentConfig,
    TSharedStoryConfig
  >;
};

export function mergeSharedScrollStoryConfig<
  TSharedSegmentConfig extends SharedScrollStorySegmentConfig,
  TSharedStoryConfig extends Record<string, unknown> = Record<string, never>,
>({
  story,
  storyId,
  sharedConfig,
}: MergeSharedScrollStoryConfigOptions<
  TSharedSegmentConfig,
  TSharedStoryConfig
>): Story {
  if (story.id !== storyId) {
    return story;
  }

  const {
    splashscreen: sharedSplashscreen,
    modules: sharedModules = [],
    ...sharedStoryFields
  } = sharedConfig;

  if (sharedModules.length !== story.modules.length) {
    console.warn(
      `Shared ${storyId} config has ${sharedModules.length} modules, but story payload has ${story.modules.length}. Merging available indexes only.`,
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
