import {GlobeView} from './globe-view';

export interface Story {
  id: string;
  slides: Slide[];
}

export interface Slide {
  title: string;
  subtitle: string;
  bodytext: string;
  image: string;
  flyTo: GlobeView;
}
