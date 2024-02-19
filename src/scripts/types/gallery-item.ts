import {ImageFit} from './image-fit';
import {Marker} from './marker-type';
import {StoryLayer} from './story-layer';

export enum GalleryItemType {
  Video = 'video',
  Image = 'image',
  Embedded = 'embedded',
  Globe = 'globe'
}

export interface ImageItem {
  type: GalleryItemType.Image;
  imageCaption?: string;
  image: string;
  imageFit?: ImageFit;
}

export interface VideoItem {
  type: GalleryItemType.Video;
  videoId?: string;
  videoSrc?: string[];
  videoCaptions?: string;
  videoPoster?: string;
}

export interface EmbeddedItem {
  type: GalleryItemType.Embedded;
  description?: string;
  embeddedSrc?: string;
}

export interface GlobeItem {
  type: GalleryItemType.Globe;
  flyTo: {
    position: {
      longitude: number;
      latitude: number;
      height: number;
    };
    orientation: {
      heading: number;
      pitch: number;
      roll: number;
    };
  };
  markers: Marker[];
  layer?: StoryLayer[];
  layerDescription?: string;
}
