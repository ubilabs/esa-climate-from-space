import { FunctionComponent, useEffect } from "react";
import { useSelector } from "react-redux";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";

import { State } from "../../../reducers";
import { layerDetailsSelector } from "../../../selectors/layers/layer-details";
import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";
import { layersApi, useGetLayerQuery } from "../../../services/api";

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

  // load layer list on mount
  useEffect(() => {
    // Add a subscription
    const result = dispatch(layersApi.endpoints.getLayers.initiate("en"));

    // Return the `unsubscribe` callback to be called in the `useEffect` cleanup step
    return result.unsubscribe;
  }, [dispatch]);

  // fetch layer if it is selected and not already downloaded
  // fetch layer details using RTK Query hooks
  const {} = useGetLayerQuery(mainId ?? "", { skip: !mainId });
  const {} = useGetLayerQuery(compareId ?? "", { skip: !compareId });

  return null;
};

export default LayerLoader;
