import { FunctionComponent } from "react";

import Story from "../../story";
import IntroModule from "./modules/intro/intro-module";
import RadiativePowerThresholdModule from "./modules/radiative-power-threshold/radiative-power-threshold";
import BurnedAreaModule from "./modules/burned-area/burned-area";
import PortugalDataLayersModule from "./modules/portugal-data-layers/portugal-data-layers";

export type StoryXFiresCompoundComponents = {
  IntroModule: typeof IntroModule;
  RadiativePowerThreshold: typeof RadiativePowerThresholdModule;
  BurnedArea: typeof BurnedAreaModule;
  PortugalDataLayers: typeof PortugalDataLayersModule;
};

/* Module Wrapper for xFires Story Components */
export const StoryXFires: FunctionComponent &
  StoryXFiresCompoundComponents = () => {
  return <Story />;
};

StoryXFires.IntroModule = IntroModule;
StoryXFires.RadiativePowerThreshold = RadiativePowerThresholdModule;
StoryXFires.BurnedArea = BurnedAreaModule;
StoryXFires.PortugalDataLayers = PortugalDataLayersModule;
