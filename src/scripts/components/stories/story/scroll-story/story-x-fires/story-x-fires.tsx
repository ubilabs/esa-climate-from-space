import { FunctionComponent } from "react";

import Story from "../../story";
import RadiativePowerThresholdModule from "./modules/radiative-power-threshold/radiative-power-threshold";

export type StoryXFiresCompoundComponents = {
  RadiativePowerThreshold: typeof RadiativePowerThresholdModule;
};

/* Module Wrapper for xFires Story Components */
export const StoryXFires: FunctionComponent &
  StoryXFiresCompoundComponents = () => {
  return <Story />;
};

StoryXFires.RadiativePowerThreshold = RadiativePowerThresholdModule;
