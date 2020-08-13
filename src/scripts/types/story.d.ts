import {GlobeView} from './globe-view';
import {StoryLayer} from './story-layer';
import {SlideType} from './slide-type';

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
  videoId?: string;
  layer?: StoryLayer[];
  flyTo: GlobeView;
}
