import { ComponentProps, FunctionComponent } from "react";

import { EmbeddedItem, GlobeItem, ImageItem, VideoItem } from "./gallery-item";
import { ImageGallery } from "../components/stories/story/blocks/image-gallery/image-gallery";
import { StoryEEI } from "../components/stories/story/blocks/story-eei/story-eei";

export interface Slide {
  text: string;
  shortText?: string;
  galleryItems: (ImageItem | VideoItem | EmbeddedItem | GlobeItem)[];
  splashImage?: string;
}

export interface LegacyStoryType {
  id: string;
  slides: Slide[];
}

export type Story = {
  id: string;
  splashscreen: Splashscreen;
  modules: Module[];
  // special property for StoryEEI
  initialGlobeConfig?: ScrollGlobe;
};

export type ImageFocus =
  | "center"
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "contain";

export interface ScrollGlobe {
  title?: string;
  containerPosition: {
    x: number;
    y: number;
  };
  location: {
    lng: number;
    lat: number;
    altitude: number;
  };
}

export interface GlobeKeyframe {
  progress: number; // 0 to 1, relative to the module
  mobile: ScrollGlobe;
  desktop?: ScrollGlobe;
}

export type Location = ScrollGlobe["location"];

export type ScrollGlobeValues = ScrollGlobe["location"] &
  ScrollGlobe["containerPosition"];

export type ContainerPosition = {
  x: number;
  y: number;
};

export type Splashscreen = {
  location?: Location;
  containerPosition?: ContainerPosition;
  url?: string;
  slides?: Array<{ text: string }>;
  title?: string;
  focus?: ImageFocus;
  subtitle?: string;
  globeKeyframes?: GlobeKeyframe[];
  lengthFactor?: number;
  type?: string;
};

export type ImageGalleryModuleType =
  | "textOverlay"
  | "imageWavelength"
  | "imageCompare"
  | "imageTime"
  | "imageScroll"
  | "textBodyLarge"
  | "imageCarousel"
  | "globe";

export type StoryEEIModuleType =
  | "kettleAmountModule"
  | "kettleCount"
  | "animatedArrowsModule"
  | "scrollTextSlide"
  | "kettleAmountModule"
  | "treeMapModule";

type BaseModule = {
  text?: string;
  altText?: string;
  slides?: BaseModuleSlide[];
  startButtonText?: string;
  focus?: ImageFocus;
  url?: string;
  globe?: GlobeItem;
  leading?: boolean;
};

export type ImageModule = BaseModule & {
  type: ImageGalleryModuleType;
};

export type ImageCarouselSlide = BaseModuleSlide & {
  layer?: {
    layerId: string;
    name: string;
  };
};

export type ImageCarouselModule = ImageModule & {
  type: "imageCarousel";
  lengthFactor?: number;
  headerText?: string;
  readMore?: {
    title: string;
    url: string;
  };
  slides?: ImageCarouselSlide[];
};

export type ScrollTextSlideType = {
  content: {
    text: string;
  };
};

export type TreeMapModule = {
  title: {
    grid: string;
    globe: string;
  };
  data: {
    label: string;
    layerId: string;
    percentage: {
      grid: number;
      globe: number;
    };
  }[];
};

export type StoryEEIModule = Pick<BaseModule, "text"> & {
  globeKeyframes?: GlobeKeyframe[];
  lengthFactor: number;
  content?: Record<string, string>;
} & (
    | { type: "kettleCount" }
    | { type: "animatedArrowsModule" }
    | { type: "kettleAmountModule" }
    | ({ type: "scrollTextSlide" } & ScrollTextSlideType)
    | ({ type: "treeMapModule" } & TreeMapModule)
  );

export type BaseModuleSlide = {
  url?: string;
  altText?: string;
  text: string;
  focus?: ImageFocus;
  flag: string;
  caption: string;
};

// Extend with union for other block types if needed
export type Module = ImageModule | ImageCarouselModule | StoryEEIModule;

export type ModuleType = Module["type"];

export type AnchorKey = `${number}-${number}-${number}`;

export type GetRefCallback = (
  index: number,
  subIndex: number,
) => (node: HTMLElement | null) => void;

export type StorySectionProps = {} & ComponentProps<"div">;

export const imageGalleryModuleMap: Record<
  ImageModule["type"],
  FunctionComponent<StorySectionProps>
> = {
  imageWavelength: ImageGallery.ImageWavelength,
  imageCompare: ImageGallery.ImageCompare,
  imageTime: ImageGallery.ImageTime,
  imageScroll: ImageGallery.ImageScroll,
  textOverlay: ImageGallery.TextOverlay,
  textBodyLarge: ImageGallery.TextBodyLarge,
  imageCarousel: ImageGallery.ImageCarousel,
  globe: ImageGallery.StoryGlobe,
};

export const storyEEIModuleMap: Record<
  StoryEEIModule["type"],
  FunctionComponent<StorySectionProps>
> = {
  kettleAmountModule: StoryEEI.KettleAmountModule,
  animatedArrowsModule: StoryEEI.AnimatedArrowsModule,
  kettleCount: StoryEEI.KettleCount,
  scrollTextSlide: StoryEEI.ScrollTextSlide,
  treeMapModule: StoryEEI.TreeMapModule,
};
