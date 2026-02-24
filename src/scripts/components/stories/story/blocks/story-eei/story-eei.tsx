import { FunctionComponent, ReactNode } from "react";

import TextOverlay from "../generic/text-overlay/text-overlay";
import BaseSlide from "./modules/base-slide/base-slide";

export type StoryEEICompoundComponents = {
  TextOverlay: typeof TextOverlay;
  BaseSlide: typeof BaseSlide;
};

/* Module Wrapper for Earth Engine Imbalance Story Components*/
export const StoryEEI = (({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
}) as FunctionComponent<{ children: ReactNode }> & StoryEEICompoundComponents;

StoryEEI.TextOverlay = TextOverlay;
StoryEEI.BaseSlide = BaseSlide;
