import { EmbeddedItem, GlobeItem, ImageItem, VideoItem } from "./gallery-item";

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
  type: "imageGallery"; // Extend with union for other types if needed
  blocks: ImageGalleryBlock[];
};

export type ImageGalleryBlock = {
  type: "frequencyBlend" | "compareMode" | "timeBlend"; // Add more block types as needed
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
