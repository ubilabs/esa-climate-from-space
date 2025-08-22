import { ComponentProps, FunctionComponent } from "react";

import { EmbeddedItem, GlobeItem, ImageItem, VideoItem } from "./gallery-item";
import ImageWavelength from "../components/stories/story/blocks/image-gallery/modules/image-wavelength/image-wavelength";
import ImageCompare from "../components/stories/story/blocks/image-gallery/modules/image-compare/image-compare";
import ImageTime from "../components/stories/story/blocks/image-gallery/modules/image-time/image-time";
import ImageScroll from "../components/stories/story/blocks/image-gallery/modules/image-scroll/image-scroll";
import TextOverlay from "../components/stories/story/blocks/generic/text-overlay/text-overlay";
import { ImageGallery } from "../components/stories/story/blocks/image-gallery/image-gallery";

export interface Slide {
  text: string;
  shortText?: string;
  galleryItems: (ImageItem | VideoItem | EmbeddedItem | GlobeItem)[];
  splashImage?: string;
}

export interface LegacyStory {
  id: string;
  slides: Slide[];
}

export type Story = {
  id: string;
  splashscreen: Splashscreen;
  blocks: ContentBlock[];
};

export type Splashscreen = {
  description: string;
  location: Record<string, unknown>;
  markers: unknown[]; // Use a more specific type if marker structure is known
  image: string;
};

// Extend with union for other types if needed
export type BlockType = "imageGallery";

export type ContentBlock = {
  type: BlockType;
  modules: Module[];
};

// Extend with union for other block types if needed
export type Module = ImageModule;

export type ModuleType = ImageModule["type"];

export type ImageGalleryModuleType =
  | "textOverlay"
  | "imageWavelength"
  | "imageCompare"
  | "imageTime"
  | "imageScroll";

export type ImageModule = {
  type: ImageGalleryModuleType;
  text?: string;
  caption?: string;
  slides?: ImageModuleSlide[];
  buttonText?: string;
};

export type ImageModuleSlide = {
  url: string;
  altText: string;
  description?: string;
  captions: string[];
  fit?: "cover" | "contain";
};

export type StorySectionProps = {
} & ComponentProps<"div">;

export const imageGalleryModuleMap: Record<
  ImageModule["type"],
  FunctionComponent<StorySectionProps>
> = {
  imageWavelength: ImageGallery.ImageWavelength,
  imageCompare: ImageGallery.ImageCompare,
  imageTime: ImageGallery.ImageTime,
  imageScroll: ImageGallery.ImageScroll,
  textOverlay: ImageGallery.TextOverlay,
};

export const imageGalleryBlockComponentMap: Record<
  ImageModule["type"],
  FunctionComponent<StorySectionProps> | undefined
> = {
  imageWavelength: ImageWavelength,
  imageCompare: ImageCompare,
  imageTime: ImageTime,
  imageScroll: ImageScroll,
  textOverlay: TextOverlay,
};
