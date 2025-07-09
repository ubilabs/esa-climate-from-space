import { FunctionComponent, ReactNode } from "react";

import FrequencyBlend from "./formats/frequency-blend/frequency-blend";
import CompareMode from "./formats/compare-mode/compare-mode";
import TimeBlend from "./formats/time-blend/time-blend";
import ScrollCaption from "./formats/scroll-caption/scroll-caption";
import ScrollOverlay from "./formats/scroll-overlay/scrollOverlay";

import styles from "./image-gallery.module.css";

export type ImageGalleryCompoundComponents = {
  FrequencyBlend: typeof FrequencyBlend;
  CompareMode: typeof CompareMode;
  TimeBlend: typeof TimeBlend;
  ScrollCaption: typeof ScrollCaption;
  ScrollOverlay: typeof ScrollOverlay;
};

export const ImageGallery = (({ children }: { children: ReactNode }) => {
  return <article className={styles.imageGallery}>{children}</article>;
}) as FunctionComponent<{ children: ReactNode }> &
  ImageGalleryCompoundComponents;

ImageGallery.FrequencyBlend = FrequencyBlend;
ImageGallery.CompareMode = CompareMode;
ImageGallery.TimeBlend = TimeBlend;
ImageGallery.ScrollCaption = ScrollCaption;
ImageGallery.ScrollOverlay = ScrollOverlay;
