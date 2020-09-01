import {LayerType} from './globe-layer-type';

export interface GlobeImageLayerData {
  id: string;
  type: LayerType;
  url: string;
  nextUrls: string[];
  zoomLevels: number;
}
