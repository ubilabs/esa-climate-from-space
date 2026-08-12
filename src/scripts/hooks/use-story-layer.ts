import { useEffect, useEffectEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setSelectedLayerIds } from "../reducers/layers";
import { selectedLayerIdsSelector } from "../selectors/layers/selected-ids";

export const useStoryLayer = (
  initialLayerId: string,
  storyLayerIds: readonly string[],
) => {
  const dispatch = useDispatch();
  const { mainId } = useSelector(selectedLayerIdsSelector);

  const selectStoryLayer = useEffectEvent(() => {
    dispatch(
      setSelectedLayerIds({ layerId: initialLayerId, isPrimary: true }),
    );

    return () => {
      if (mainId && storyLayerIds.includes(mainId)) {
        dispatch(setSelectedLayerIds({ layerId: null, isPrimary: true }));
      }
    };
  });

  useEffect(() => selectStoryLayer(), []);
};
