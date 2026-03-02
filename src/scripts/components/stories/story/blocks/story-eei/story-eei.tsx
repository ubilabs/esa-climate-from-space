import { FunctionComponent, ReactNode } from "react";

import TextOverlay from "../generic/text-overlay/text-overlay";
import BaseScrollModule from "./modules/base-scroll/base-scroll-module";
import StoryGlobe from "../globe/story-globe/story-globe";

export type StoryEEICompoundComponents = {
  TextOverlay: typeof TextOverlay;
  BaseSlide: typeof BaseScrollModule;
  StoryGlobe: typeof StoryGlobe;
};

/* Module Wrapper for Earth Engine Imbalance Story Components*/
export const StoryEEI = (({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
}) as FunctionComponent<{ children: ReactNode }> & StoryEEICompoundComponents;

StoryEEI.TextOverlay = TextOverlay;
StoryEEI.BaseSlide = BaseScrollModule;
StoryEEI.StoryGlobe = StoryGlobe;
