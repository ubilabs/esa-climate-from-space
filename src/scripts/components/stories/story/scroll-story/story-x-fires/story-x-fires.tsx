import { FunctionComponent } from "react";

import { useStoryLayer } from "../../../../../hooks/use-story-layer";

import Story from "../../story";
import { Layers } from "./constants/globe";
import RadiativePowerThresholdModule from "./modules/radiative-power-threshold/radiative-power-threshold";
import BurnedAreaModule from "./modules/burned-area/burned-area";
import IntroModule from "./modules/intro/intro-module";
import NamingTheBeast from "./modules/name-the-beast/naming-the-beast";

export type StoryXFiresCompoundComponents = {
  IntroModule: typeof IntroModule;
  RadiativePowerThreshold: typeof RadiativePowerThresholdModule;
  BurnedArea: typeof BurnedAreaModule;
  NamingTheBeast: typeof NamingTheBeast;
};

/* Module Wrapper for xFires Story Components */
export const StoryXFires: FunctionComponent &
  StoryXFiresCompoundComponents = () => {
  useStoryLayer(Layers.XFIRES_GLOBAL_FIRES, Object.values(Layers));

  return <Story />;
};

StoryXFires.RadiativePowerThreshold = RadiativePowerThresholdModule;
StoryXFires.BurnedArea = BurnedAreaModule;
StoryXFires.IntroModule = IntroModule;
StoryXFires.NamingTheBeast = NamingTheBeast;
