import { GlobeKeyframe, ScrollGlobe } from "../types/story";

export type SharedScrollStorySegmentConfig = {
  globeKeyframes?: GlobeKeyframe[];
  lengthFactor?: number;
};

export type SharedScrollStoryConfig = {
  initialglobeConfig?: { mobile: ScrollGlobe; desktop: ScrollGlobe };
  splashscreen?: SharedScrollStorySegmentConfig;
  modules?: SharedScrollStorySegmentConfig[];
};

// add here any story id with a shared config file
export const sharedScrollStoryIds = new Set<string>(["story-x-fires"]);
