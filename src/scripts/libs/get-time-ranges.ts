import {Layer} from '../types/layer';
import {TimeRange} from '../types/time-range';

export function getTimeRanges(
  mainLayer: Layer | null,
  compareLayer: Layer | null
): {
  main: TimeRange | null;
  compare: TimeRange | null;
  combined: TimeRange;
} {
  const mainRange = getLayerTimeRange(mainLayer);
  const mainTimestamps = mainRange?.timestamps || [];
  const compareRange = getLayerTimeRange(compareLayer);
  const compareTimestamps = compareRange?.timestamps || [];

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
    min: Number(sorted[0]) || -Infinity,
    max: Number(sorted[sorted.length - 1]) || Infinity,
    timestamps: sorted.map(date => date.toISOString())
  };
}
