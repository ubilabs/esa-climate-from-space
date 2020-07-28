import {GlobeView} from './globe-view';

interface LayerListItem {
  id: string;
  name: string;
  description: string;
  link: string;
  subLayers: LayerListItem[];
  flyTo: GlobeView;
}

export type LayerList = LayerListItem[];
