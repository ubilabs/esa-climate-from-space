import { Layer } from "../types/layer";

export default function getPlaybackStep(
  mainLayerDetails: Layer | null,
  compareLayerDetails: Layer | null,
): number {
  const averageStepSizes = [mainLayerDetails, compareLayerDetails]
    .map((layerDetails) => {
      const timestamps = layerDetails?.timestamps ?? [];
      const stepCount = timestamps.length - 1;

      let totalTime = 0;

      for (let index = 0; index < stepCount; index++) {
        const timestamp = timestamps[index];
        const nextTimestamp = timestamps[index + 1];

        totalTime +=
          new Date(nextTimestamp).getTime() - new Date(timestamp).getTime();
      }

      return totalTime / stepCount;
    })
    .filter((averageTime) => averageTime > 0);

  return Math.min(...averageStepSizes);
}
