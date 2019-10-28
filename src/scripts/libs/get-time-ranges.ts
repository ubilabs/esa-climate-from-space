import {SelectedLayersState} from '../reducers/layers/selected';
import {DetailsById} from '../reducers/layers/details';

import {Layer} from '../types/layer';
import {TimeRange} from '../types/time-range';

// eslint-disable-next-line complexity
export function getTimeRanges(
  selectedLayers: SelectedLayersState,
  detailedLayers: DetailsById
): {
  main: TimeRange | null;
  compare: TimeRange | null;
  combined: TimeRange;
} {
  const mainId = selectedLayers.main;
  const mainLayer = (mainId && detailedLayers[mainId]) || null;
  const mainRange = getLayerTimeRange(mainLayer);
  const mainTimestamps = (mainRange && mainRange.timestamps) || [];

  const compareId = selectedLayers.compare;
  const compareLayer = (compareId && detailedLayers[compareId]) || null;
  const compareRange = getLayerTimeRange(compareLayer);
  const compareTimestamps = (compareRange && compareRange.timestamps) || [];

  const combinedRange = getTimeRange([...mainTimestamps, ...compareTimestamps]);

  return {
    main: mainRange,
    compare: compareRange,
    combined: combinedRange
  };
}

function getLayerTimeRange(layer: Layer | null): TimeRange | null {
  if (!layer || layer.timestamps.length < 2) {
    return null;
  }

  return getTimeRange(layer.timestamps);
}

function getTimeRange(timestamps: string[]): TimeRange {
  const sorted = timestamps
    .map((isoString: string) => new Date(isoString))
    .sort((a: Date, b: Date) => Number(a) - Number(b));

  return {
    min: Number(sorted[0]) || 0,
    max: Number(sorted[sorted.length - 1]) || 0,
    timestamps: sorted.map(date => date.toISOString())
  };
}
