import {GlobeView} from './globe-view';
import {StoryLayer} from './story-layer';

export interface Story {
  id: string;
  slides: Slide[];
}

export interface Slide {
  text: string;
  shortText?: string;
  images?: string[];
  videoId?: string;
  layer?: StoryLayer;
  fullscreenGallery?: boolean;
  flyTo: GlobeView;
}
