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
  content: ContentBlock[];
};

export type Splashscreen = {
  description: string;
  location: Record<string, unknown>;
  markers: unknown[]; // Use a more specific type if marker structure is known
  image: string;
  shortText?: string;
};

export type ContentBlockType = "imageGallery"; // Extend with union for other types if needed

export type ContentBlock = {
  type: ContentBlockType;
  blocks: ImageGalleryFormat[];
};

export type ImageGalleryFormatType =
  | "textOverlay"
  | "imageWavelength"
  | "imageCompare"
  | "imageTime"
  | "imageScroll";

export type ImageGalleryFormat = {
  type: ImageGalleryFormatType;
  description?: string;
  caption?: string;
  shortText?: string;
  slides: ImageSlide[];
  buttonText?: string;
};

export type ImageSlide = {
  url: string;
  altText: string;
  description?: string;
  captions: string[];
  fit?: "cover" | "contain";
};

export type StorySectionProps = {
  getRefCallback?: (index: number) => (node: HTMLElement | null) => void;
} & ComponentProps<"div">;

export const imageGalleryFormatMap: Record<
  ImageGalleryFormat["type"],
  FunctionComponent<StorySectionProps>
> = {
  imageWavelength: ImageGallery.ImageWavelength,
  imageCompare: ImageGallery.ImageCompare,
  imageTime: ImageGallery.ImageTime,
  imageScroll: ImageGallery.ImageScroll,
  textOverlay: ImageGallery.TextOverlay,
};

export const imageGalleryBlockComponentMap: Record<
  ImageGalleryFormat["type"],
  FunctionComponent<StorySectionProps> | undefined
> = {
  imageWavelength: ImageWavelength,
  imageCompare: ImageCompare,
  imageTime: ImageTime,
  imageScroll: ImageScroll,
  textOverlay: TextOverlay,
};
