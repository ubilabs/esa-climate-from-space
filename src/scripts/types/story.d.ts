import {GlobeView} from './globe-view';

export interface Story {
  id: string;
  slides: Slide[];
}

export interface Slide {
  title: string;
  subtitle: string;
  bodytext: string;
  images?: [];
  videoId?: string;
  flyTo: GlobeView;
  fullscreenGallery?: boolean;
}
