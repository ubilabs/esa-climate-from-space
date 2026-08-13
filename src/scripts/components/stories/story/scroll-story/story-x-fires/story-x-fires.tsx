import { FunctionComponent } from "react";

import { useStoryLayer } from "../../../../../hooks/use-story-layer";

import Story from "../../story";
import { Layers } from "./constants/globe";
import IntroModule from "./modules/intro/intro-module";
import RadiativePowerThresholdModule from "./modules/radiative-power-threshold/radiative-power-threshold";
import BurnedAreaModule from "./modules/burned-area/burned-area";
import NamingTheBeast from "./modules/name-the-beast/naming-the-beast";
import HurricaneOphelia from "./modules/hurricane-ophelia/hurricane-ophelia";
import PortugalDataLayersModule from "./modules/portugal-data-layers/portugal-data-layers";

export type StoryXFiresCompoundComponents = {
  IntroModule: typeof IntroModule;
  RadiativePowerThreshold: typeof RadiativePowerThresholdModule;
  BurnedArea: typeof BurnedAreaModule;
  NamingTheBeast: typeof NamingTheBeast;
  HurricaneOphelia: typeof HurricaneOphelia
  PortugalDataLayers: typeof PortugalDataLayersModule;
};

/* Module Wrapper for xFires Story Components */
export const StoryXFires: FunctionComponent &
  StoryXFiresCompoundComponents = () => {
  useStoryLayer(Layers.XFIRES_GLOBAL_FIRES, Object.values(Layers));

  return <Story />;
};

StoryXFires.IntroModule = IntroModule;
StoryXFires.RadiativePowerThreshold = RadiativePowerThresholdModule;
StoryXFires.BurnedArea = BurnedAreaModule;
StoryXFires.NamingTheBeast = NamingTheBeast;
StoryXFires.HurricaneOphelia = HurricaneOphelia
StoryXFires.PortugalDataLayers = PortugalDataLayersModule;
