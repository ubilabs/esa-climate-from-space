import { FunctionComponent, ReactNode, useState } from "react";

import {
  GalleryFormats,
  ImageGalleryContext,
} from "./formats/image-gallery-context";
import FrequencyBlend from "./formats/frequency-blend/frequency-blend";
import CompareMode from "./formats/compare-mode/compare-mode";
import TimeBlend from "./formats/time-blend/time-blend";
import ScrollCaption from "./formats/scroll-caption/scroll-caption";
import ScrollOverlay from "./formats/scroll-overlay/scrollOverlay";

type ImageGalleryCompoundComponents = {
  FrequencyBlend: typeof FrequencyBlend;
  CompareMode: typeof CompareMode;
  TimeBlend: typeof TimeBlend;
  ScrollCaption: typeof ScrollCaption;
  ScrollOverlay: typeof ScrollOverlay;
};

export const ImageGallery: FunctionComponent<{ children: ReactNode }> &
  ImageGalleryCompoundComponents = ({ children }) => {
    const [mode, setMode] = useState<GalleryFormats>(GalleryFormats.Blend);

    return (
      <ImageGalleryContext.Provider value={{ mode, setMode }}>
        <div className="image-gallery">{children}</div>
      </ImageGalleryContext.Provider>
    );
  };

// Add format components
ImageGallery.FrequencyBlend = FrequencyBlend;
ImageGallery.CompareMode = CompareMode;
ImageGallery.TimeBlend = TimeBlend;
ImageGallery.ScrollCaption = ScrollCaption;
ImageGallery.ScrollOverlay = ScrollOverlay;
