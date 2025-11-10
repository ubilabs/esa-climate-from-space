import { BasemapId } from "../types/basemap";
import { LayerType } from "./globe-layer-type";
import { LegendValueColor } from "./legend-value-color";

export interface Layer {
  id: string;
  type: LayerType;
  zoomLevels: number;
  basemap: BasemapId | null;
  timestamps: string[]; // ISO 8601 timestamps
  timeFormat: {
    year?: "numeric" | "2-digit";
    month?: "numeric" | "2-digit" | "narrow" | "short" | "long";
    day?: "numeric" | "2-digit";
    hour?: "numeric" | "2-digit";
    minute?: "numeric" | "2-digit";
    second?: "numeric" | "2-digit";
  };
  filter?: string;
  minValue: number;
  maxValue: number;
  units: string;
  legendValues: string[] | LegendValueColor[];
  legendBackgroundColor: string;
  hideLegend?: boolean;
}
