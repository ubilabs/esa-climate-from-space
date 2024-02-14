import {StoryLayer} from './story-layer';
import {SlideType} from './slide-type';
import {Marker} from './marker-type';
import {ImageFit} from './image-fit';

export interface LegacySlide {
  type: SlideType;
  text: string;
  shortText?: string;
  images?: string[];
  imageCaptions?: string[];
  imageFits?: ImageFit[];
  videoId?: string;
  videoSrc?: string[];
  videoCaptions?: string;
  videoPoster?: string;
  embeddedSrc?: string;
  layer?: StoryLayer[];
  layerDescription?: string;
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
}

export interface LegacyStory {
  id: string;
  slides: LegacySlide[];
  isCurrentStory?: boolean;
}
