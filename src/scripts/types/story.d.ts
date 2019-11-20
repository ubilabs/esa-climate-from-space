import {GlobeView} from './globe-view';

export interface Story {
  id: string;
  slides: Slide[];
}

export interface Slide {
  bodytext: string;
  bulletList?: string;
  images?: [];
  videoId?: string;
  flyTo: GlobeView;
  fullscreenGallery?: boolean;
}
