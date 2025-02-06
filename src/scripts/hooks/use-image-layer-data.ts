import { useMemo } from "react";

import {
  getLayerTimeIndex,
  getImageLayerData,
} from "../libs/get-image-layer-data";

import { Layer } from "../types/layer";

export function useImageLayerData(layerDetails: Layer | null, time: number) {
  const timeIndex = getLayerTimeIndex(time, layerDetails?.timestamps ?? []);

  const mainImageLayer = useMemo(
    () => getImageLayerData(layerDetails, timeIndex),
    [layerDetails, timeIndex],
  );

  return mainImageLayer;
}
