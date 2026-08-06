import { AppRoute } from "../types/app-routes";
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

export const sharedScrollStoryIds = new Set<AppRoute>([AppRoute.StoryEEI]);
