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
import CanadianFiresModule from "./modules/canadian-fires/canadian-fires";
import ZoomToPortugalModule from "./modules/zoom-to-portugal/zoom-to-portugal-module";
import AustralianFiresModule from "./modules/australian-fires/australian-fires";
import OutroModule from "./modules/outro/outro";

export type StoryXFiresCompoundComponents = {
  IntroModule: typeof IntroModule;
  RadiativePowerThreshold: typeof RadiativePowerThresholdModule;
  BurnedArea: typeof BurnedAreaModule;
  NamingTheBeast: typeof NamingTheBeast;
  HurricaneOphelia: typeof HurricaneOphelia;
  PortugalDataLayers: typeof PortugalDataLayersModule;
  CanadianFires: typeof CanadianFiresModule;
  ZoomToPortugal: typeof ZoomToPortugalModule;
  AustralianFires: typeof AustralianFiresModule;
  Outro: typeof OutroModule;
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
StoryXFires.HurricaneOphelia = HurricaneOphelia;
StoryXFires.PortugalDataLayers = PortugalDataLayersModule;
StoryXFires.CanadianFires = CanadianFiresModule;
StoryXFires.ZoomToPortugal = ZoomToPortugalModule;
StoryXFires.AustralianFires = AustralianFiresModule;
StoryXFires.Outro = OutroModule;
