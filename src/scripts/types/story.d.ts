import {GlobeView} from './globe-view';
import {StoryLayer} from './story-layer';
import {SlideType} from './slide-type';
import {Marker} from './marker-type';
import {ImageType} from './image-type';

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
  imageTypes?: ImageType[];
  videoId?: string;
  layer?: StoryLayer[];
  layerDescription?: string;
  flyTo: GlobeView;
  markers: Marker[];
}
