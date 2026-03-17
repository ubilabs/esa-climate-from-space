import { FunctionComponent, useEffect, useLayoutEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

import { Layers } from "./constants/globe";

import { setSelectedLayerIds } from "../../../../../reducers/layers";

import { useStory } from "../../../../../providers/story/use-story";

import Story from "../../story";
import GlobeScroll from "./globe-scroll";
import ScrollModule from "./modules/base-scroll/module/scroll-module";
import StoryGlobe from "../globe/story-globe/story-globe";
import KettleAmountModule from "./modules/kettle-amount/kettle-amount";
import AnimatedArrowsModule from "./modules/animated-arrows/animated-arrows";
import KettleCount from "./modules/kettle-count/kettle-count";
import QuoteSlide from "./modules/quote-slide/quote-slide";
import TreeMapModule from "./modules/tree-map/tree-map";
import { setFlyTo } from "../../../../../reducers/fly-to";
import { useScreenSize } from "../../../../../hooks/use-screen-size";

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
  const { story } = useStory();

  const { isMobile } = useScreenSize();

  const initialGlobe = useMemo(
    () => story?.initialglobeConfig ?? undefined,
    [story],
  );

  // set initial globe container position
  useLayoutEffect(() => {
    const device = isMobile ? "mobile" : "desktop";

    const initialContainer = initialGlobe?.[device].containerPosition
    const initialPosition = initialGlobe?.[device].location

    const root = document.documentElement;

    if (initialContainer) {
      root.style.setProperty(
        "--globe-container-y",
        `${initialContainer.y * -100}vh`,
      );

      root.style.setProperty(
        "--globe-container-x",
        `${initialContainer.x * -100}vw`,
      );
    }
    if (initialPosition) {
      dispatch(
        setFlyTo({
          lat: initialPosition.lat,
          lng: initialPosition.lng,
          altitude: initialPosition.altitude,
        }),
      );
    }
  }, [initialGlobe, dispatch, isMobile]);

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
      <GlobeScroll initialGlobeConfiguration={initialGlobe} />
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
