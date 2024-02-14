import {EmbeddedItem, GlobeItem, ImageItem, VideoItem} from './gallery-item';

export interface Slide {
  text: string;
  shortText?: string;
  galleryItems: (ImageItem | VideoItem | EmbeddedItem | GlobeItem)[];
  splashImage?: string;
}

export interface Story {
  isCurrentStory?: boolean;
  id: string;
  slides: Slide[];
}
