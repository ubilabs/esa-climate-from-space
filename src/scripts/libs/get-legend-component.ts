import { FunctionComponent } from "react";
import { LegendType, Legend, LegendEntry } from "../types/story";
import ContinuousLegend from "../components/stories/story/scroll-story/modules/legends/continuous-legend/continuous-legend";
import CategoricalLegend from "../components/stories/story/scroll-story/modules/legends/categorical-legend/categorical-legend";

// Map of block types to their respective module components
// Extendable map to include additional modules as needed
export const legendComponentMap: Record<
  LegendType,
  FunctionComponent<{ legend: Legend; legendEntries: LegendEntry[] }>
> = {
  continuous: ContinuousLegend,
  categorical: CategoricalLegend,
};
