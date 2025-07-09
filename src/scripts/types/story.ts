import { FunctionComponent } from "react";

import { EmbeddedItem, GlobeItem, ImageItem, VideoItem } from "./gallery-item";

import CompareMode from "../components/stories/story/blocks/image-gallery/formats/compare-mode/compare-mode";
import TimeBlend from "../components/stories/story/blocks/image-gallery/formats/time-blend/time-blend";
import FrequencyBlend from "../components/stories/story/blocks/image-gallery/formats/frequency-blend/frequency-blend";
import { ImageGallery } from "../components/stories/story/blocks/image-gallery/image-gallery";
import ScrollOverlay from "../components/stories/story/blocks/image-gallery/formats/scroll-overlay/scrollOverlay";
import ScrollCaption from "../components/stories/story/blocks/image-gallery/formats/scroll-caption/scroll-caption";

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
  text: string;
  location: Record<string, unknown>;
  markers: unknown[]; // Use a more specific type if marker structure is known
  image: string;
  shortText?: string;
};

export type ContentBlock = {
  type: "imageGallery" | "textBlock"; // Extend with union for other types if needed
  blocks: ImageGalleryBlock[];
};

export type ImageGalleryBlock = {
  type:
    | "scrollOverlay"
    | "frequencyBlend"
    | "compareMode"
    | "timeBlend"
    | "scrollCaption"; // Add more block types as needed
  description?: string; // optional long text
  shortText?: string;
  slides: ImageSlide[];
};

export type ImageSlide = {
  url: string;
  altText: string;
  caption: string;
  fit?: "cover" | "contain";
};

export type StorySectionProps = {
  slideIndex: number;
};

export const imageGalleryFormatMap: Record<
  ImageGalleryBlock["type"],
  FunctionComponent<StorySectionProps>
> = {
  frequencyBlend: ImageGallery.FrequencyBlend,
  timeBlend: ImageGallery.TimeBlend,
  compareMode: ImageGallery.CompareMode,
  scrollCaption: ImageGallery.ScrollCaption,
  scrollOverlay: ImageGallery.ScrollOverlay,
};

export const imageGalleryBlockComponentMap: Record<
  ImageGalleryBlock["type"],
  FunctionComponent<StorySectionProps> | undefined
> = {
  compareMode: CompareMode,
  timeBlend: TimeBlend,
  frequencyBlend: FrequencyBlend,
  scrollOverlay: ScrollOverlay,
  scrollCaption: ScrollCaption,
};
