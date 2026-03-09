import { FunctionComponent, useEffect } from "react";
import { useDispatch } from "react-redux";

import { setSelectedLayerIds } from "../../../../../reducers/layers";

import Story from "../../story";
import GlobeScroll from "./globe-scroll";
import TextOverlay from "../generic/text-overlay/text-overlay";
import ScrollModule from "./modules/base-scroll/module/scroll-module";
import StoryGlobe from "../globe/story-globe/story-globe";
import KettleAmountModule from "./modules/kettle-amount/kettle-amount";
import AnimatedArrowsModule from "./modules/animated-arrows/animated-arrows";

export type StoryEEICompoundComponents = {
  TextOverlay: typeof TextOverlay;
  BaseSlide: typeof ScrollModule;
  StoryGlobe: typeof StoryGlobe;
  KettleAmountModule: typeof KettleAmountModule;
  AnimateSVGTextModule: typeof AnimatedArrowsModule;
};

/* Module Wrapper for Earth Engine Imbalance Story Components*/
export const StoryEEI: FunctionComponent & StoryEEICompoundComponents = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSelectedLayerIds({ layerId: "water_mask", isPrimary: true }));
    return () => {
      dispatch(setSelectedLayerIds({ layerId: null, isPrimary: true }));
    };
  }, [dispatch]);

  return (
    <Story>
      {/* enable globe to react to scroll event (currently only story-eei)*/}
      <GlobeScroll />
    </Story>
  );
};

StoryEEI.TextOverlay = TextOverlay;
StoryEEI.BaseSlide = ScrollModule;
StoryEEI.StoryGlobe = StoryGlobe;
StoryEEI.KettleAmountModule = KettleAmountModule;
StoryEEI.AnimateSVGTextModule = AnimatedArrowsModule;
