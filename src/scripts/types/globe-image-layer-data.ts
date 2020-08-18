import {GlobeLayerType} from './globe-layer-type';

export interface GlobeImageLayerData {
  id: string;
  type: GlobeLayerType;
  url: string;
  nextUrls: string[];
  zoomLevels: number;
}
