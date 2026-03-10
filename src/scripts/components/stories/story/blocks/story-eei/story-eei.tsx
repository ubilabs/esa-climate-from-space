import { FunctionComponent, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Layers } from "./constants/globe";

import { setSelectedLayerIds } from "../../../../../reducers/layers";

import Story from "../../story";
import GlobeScroll from "./globe-scroll";
import ScrollModule from "./modules/base-scroll/module/scroll-module";
import StoryGlobe from "../globe/story-globe/story-globe";
import KettleAmountModule from "./modules/kettle-amount/kettle-amount";
import AnimatedArrowsModule from "./modules/animated-arrows/animated-arrows";
import KettleCount from "./modules/kettle-count/kettle-count";
import QuoteSlide from "./modules/quote-slide/quote-slide";
import TreeMapModule from "./modules/tree-map/tree-map";

export type StoryEEICompoundComponents = {
  BaseSlide: typeof ScrollModule;
  StoryGlobe: typeof StoryGlobe;
  KettleAmountModule: typeof KettleAmountModule;
  KettleCount: typeof KettleCount;
  AnimatedArrowsModule: typeof AnimatedArrowsModule;
  QuoteSlide: typeof QuoteSlide;
  TreeMapModule: typeof TreeMapModule;
};

/* Module Wrapper for Earth Engine Imbalance Story Components*/
export const StoryEEI: FunctionComponent & StoryEEICompoundComponents = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setSelectedLayerIds({ layerId: Layers.EEI_NO_MASK, isPrimary: true }),
    );
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

StoryEEI.BaseSlide = ScrollModule;
StoryEEI.QuoteSlide = QuoteSlide;
StoryEEI.StoryGlobe = StoryGlobe;
StoryEEI.KettleAmountModule = KettleAmountModule;
StoryEEI.KettleCount = KettleCount;
StoryEEI.AnimatedArrowsModule = AnimatedArrowsModule;
StoryEEI.TreeMapModule = TreeMapModule;
