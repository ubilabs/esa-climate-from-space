import {BasemapId} from '../types/basemap';
import {GlobeView} from './globe-view';

export interface Layer {
  id: string;
  type: 'image' | 'tiles';
  zoomLevels: number;
  basemap: BasemapId | null;
  timestamps: string[]; // ISO 8601 timestamps
  flyTo: GlobeView;
  timeFormat: {
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';
    day?: 'numeric' | '2-digit';
    hour?: 'numeric' | '2-digit';
    minute?: 'numeric' | '2-digit';
    second?: 'numeric' | '2-digit';
  };
  minValue: number;
  maxValue: number;
  units: string;
}
