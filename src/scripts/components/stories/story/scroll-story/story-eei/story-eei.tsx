import { FunctionComponent } from "react";

import { Layers } from "./constants/globe";

import { useStoryLayer } from "../../../../../hooks/use-story-layer";

import Story from "../../story";
import ScrollModule from "../modules/base-scroll/module/scroll-module";
import StoryGlobe from "../../blocks/globe/story-globe/story-globe";
import KettleAmountModule from "./modules/kettle-amount/kettle-amount";
import AnimatedArrowsModule from "../modules/animated-arrows/animated-arrows";
import KettleCount from "./modules/kettle-count/kettle-count";
import TreeMapModule from "./modules/tree-map/tree-map";
import SatelliteAnimation from "./satellite-animation/satellite-animation";
import ScrollTextSlide from "./modules/scroll-text-slide/scroll-text-slide";

export type StoryEEICompoundComponents = {
  BaseSlide: typeof ScrollModule;
  StoryGlobe: typeof StoryGlobe;
  KettleAmountModule: typeof KettleAmountModule;
  KettleCount: typeof KettleCount;
  AnimatedArrowsModule: typeof AnimatedArrowsModule;
  ScrollTextSlide: typeof ScrollTextSlide;
  TreeMapModule: typeof TreeMapModule;
};

/* Module Wrapper for Earth Engine Imbalance Story Components*/
export const StoryEEI: FunctionComponent & StoryEEICompoundComponents = () => {
  useStoryLayer(Layers.EEI_NO_MASK, Object.values(Layers));

  return (
    <Story>
      {/* place here any element which overlaps multiple modules */}
      <SatelliteAnimation />
    </Story>
  );
};

StoryEEI.BaseSlide = ScrollModule;
StoryEEI.ScrollTextSlide = ScrollTextSlide;
StoryEEI.StoryGlobe = StoryGlobe;
StoryEEI.KettleAmountModule = KettleAmountModule;
StoryEEI.KettleCount = KettleCount;
StoryEEI.AnimatedArrowsModule = AnimatedArrowsModule;
StoryEEI.TreeMapModule = TreeMapModule;
