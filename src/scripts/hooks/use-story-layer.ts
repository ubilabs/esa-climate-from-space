import { useEffect, useEffectEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useThunkDispatch } from "./use-thunk-dispatch";

import { setSelectedLayerIds } from "../reducers/layers";
import { selectedLayerIdsSelector } from "../selectors/layers/selected-ids";
import { layersApi } from "../services/api";

export const useStoryLayer = (
  initialLayerId: string,
  storyLayerIds: readonly string[],
) => {
  const dispatch = useDispatch();
  const thunkDispatch = useThunkDispatch();
  const { mainId } = useSelector(selectedLayerIdsSelector);

  const initStoryLayer = useEffectEvent(() => {
    // Fetch the layer details for all layers in the story to prevent loading delays.
    storyLayerIds.forEach((layerId) => {
      thunkDispatch(layersApi.endpoints.getLayer.initiate(layerId));
    });

    dispatch(setSelectedLayerIds({ layerId: initialLayerId, isPrimary: true }));

    return () => {
      if (mainId && storyLayerIds.includes(mainId)) {
        dispatch(setSelectedLayerIds({ layerId: null, isPrimary: true }));
      }
    };
  });

  useEffect(() => initStoryLayer(), []);
};
