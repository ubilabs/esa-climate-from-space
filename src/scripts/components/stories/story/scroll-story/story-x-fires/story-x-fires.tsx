import { FunctionComponent } from "react";

import Story from "../../story";
import RadiativePowerThresholdModule from "./modules/radiative-power-threshold/radiative-power-threshold";
import BurnedAreaModule from "./modules/burned-area/burned-area";

export type StoryXFiresCompoundComponents = {
  RadiativePowerThreshold: typeof RadiativePowerThresholdModule;
  BurnedArea: typeof BurnedAreaModule;
};

/* Module Wrapper for xFires Story Components */
export const StoryXFires: FunctionComponent &
  StoryXFiresCompoundComponents = () => {
  return <Story />;
};

StoryXFires.RadiativePowerThreshold = RadiativePowerThresholdModule;
StoryXFires.BurnedArea = BurnedAreaModule;
