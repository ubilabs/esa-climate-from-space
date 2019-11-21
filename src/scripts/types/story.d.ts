import {GlobeView} from './globe-view';

export interface Story {
  id: string;
  slides: Slide[];
}

export interface Slide {
  text: string;
  shortText?: string;
  images?: [];
  videoId?: string;
  flyTo: GlobeView;
  fullscreenGallery?: boolean;
}
