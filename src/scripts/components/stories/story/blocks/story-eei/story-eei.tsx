import { FunctionComponent, ReactNode } from "react";

import TextOverlay from "../generic/text-overlay/text-overlay";
import ScrollModule from "./modules/base-scroll/module/scroll-module";
import StoryGlobe from "../globe/story-globe/story-globe";
import KettleAmountModule from "./modules/kettle-amount/kettle-amount";
import AnimateSVGTextModule from "./modules/animate-svg-text/animate-svg-text";

export type StoryEEICompoundComponents = {
  TextOverlay: typeof TextOverlay;
  BaseSlide: typeof ScrollModule;
  StoryGlobe: typeof StoryGlobe;
  KettleAmountModule: typeof KettleAmountModule;
  AnimateSVGTextModule: typeof AnimateSVGTextModule;
};

/* Module Wrapper for Earth Engine Imbalance Story Components*/
export const StoryEEI = (({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
}) as FunctionComponent<{ children: ReactNode }> & StoryEEICompoundComponents;

StoryEEI.TextOverlay = TextOverlay;
StoryEEI.BaseSlide = ScrollModule;
StoryEEI.StoryGlobe = StoryGlobe;
StoryEEI.KettleAmountModule = KettleAmountModule;
StoryEEI.AnimateSVGTextModule = AnimateSVGTextModule;
