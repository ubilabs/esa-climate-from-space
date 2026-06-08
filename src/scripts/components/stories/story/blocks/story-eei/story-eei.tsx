import {
  FunctionComponent,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { Layers } from "./constants/globe";

import { setSelectedLayerIds } from "../../../../../reducers/layers";

import { selectedLayerIdsSelector } from "../../../../../selectors/layers/selected-ids";

import { useStory } from "../../../../../providers/story/use-story";

import Story from "../../story";
import GlobeScroll from "./globe-scroll";
import ScrollModule from "./modules/base-scroll/module/scroll-module";
import StoryGlobe from "../globe/story-globe/story-globe";
import KettleAmountModule from "./modules/kettle-amount/kettle-amount";
import AnimatedArrowsModule from "./modules/animated-arrows/animated-arrows";
import KettleCount from "./modules/kettle-count/kettle-count";
import TreeMapModule from "./modules/tree-map/tree-map";
import { setFlyTo } from "../../../../../reducers/fly-to";
import { useScreenInfo } from "../../../../../hooks/use-screen-info";
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
  const dispatch = useDispatch();
  const { mainId } = useSelector(selectedLayerIdsSelector);
  const { story } = useStory();

  const { isMobile } = useScreenInfo();

  const initialGlobe = useMemo(
    () => story?.initialglobeConfig ?? undefined,
    [story],
  );

  // set initial globe container position
  useLayoutEffect(() => {
    const device = isMobile ? "mobile" : "desktop";

    const initialContainer = initialGlobe?.[device].containerPosition;
    const initialPosition = initialGlobe?.[device].location;

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

  const updateSelectedEEILayer = useEffectEvent(() => {
    dispatch(
      setSelectedLayerIds({ layerId: Layers.EEI_NO_MASK, isPrimary: true }),
    );
    return () => {
      // If the current selected layer is part of the story-eei, reset it on unmount
      if (mainId && Object.values(Layers).includes(mainId as Layers)) {
        dispatch(setSelectedLayerIds({ layerId: null, isPrimary: true }));
      }
    };
  });

  useEffect(() => updateSelectedEEILayer(), []);

  return (
    <Story>
      {/* enable globe to react to scroll event (currently only story-eei)*/}
      <GlobeScroll initialGlobeConfiguration={initialGlobe} />
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
