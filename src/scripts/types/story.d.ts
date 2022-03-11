import {GlobeView} from './globe-view';
import {StoryLayer} from './story-layer';
import {SlideType} from './slide-type';
import {Marker} from './marker-type';
import {ImageFit} from './image-fit';

export interface Story {
  id: string;
  slides: Slide[];
}

export interface Slide {
  type: SlideType;
  text: string;
  shortText?: string;
  images?: string[];
  imageCaptions?: string[];
  imageFits?: ImageFit[];
  videoId?: string;
  videoSrc?: string;
  videoCaptions?: string;
  layer?: StoryLayer[];
  layerDescription?: string;
  flyTo: GlobeView;
  markers: Marker[];
}
