import { FunctionComponent, useEffect } from "react";
import { useSelector } from "react-redux";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";

import { State } from "../../../reducers";
import { layerDetailsSelector } from "../../../selectors/layers/layer-details";
import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";
import { useGetLayersQuery } from "../../../services/api";

/**
 * Handles loading of layer list and layer details data
 */
const LayerLoader: FunctionComponent = () => {
  const dispatch = useThunkDispatch();
  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const { mainId, compareId } = selectedLayerIds;
  const mainLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, mainId),
  );
  const compareLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, compareId),
  );

  const { data } = useGetLayersQuery("en");
  console.log("🚀 ~ data:", data);
  // fetch layer if it is selected and not already downloaded
  //   useEffect(() => {
  //     if (mainId && !mainLayerDetails) {
  //       dispatch(fetchLayerAction(mainId));
  //     }

  //     if (compareId && !compareLayerDetails) {
  //       dispatch(fetchLayerAction(compareId));
  //     }
  //   }, [dispatch, mainId, mainLayerDetails, compareId, compareLayerDetails]);

  return null;
};

export default LayerLoader;
