import {FunctionComponent, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import fetchLayers from '../../actions/fetch-layers';
import fetchLayerAction from '../../actions/fetch-layer';
import {State} from '../../reducers';
import {layerDetailsSelector} from '../../selectors/layers/layer-details';
import {selectedLayerIdsSelector} from '../../selectors/layers/selected-ids';

/**
 * Handles loading of layer list and layer details data
 */
const LayerLoader: FunctionComponent = () => {
  const dispatch = useDispatch();
  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const {mainId, compareId} = selectedLayerIds;
  const mainLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, mainId)
  );
  const compareLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, compareId)
  );

  // load layer list on mount
  useEffect(() => {
    dispatch(fetchLayers());
  }, [dispatch]);

  // fetch layer if it is selected and not already downloaded
  useEffect(() => {
    if (mainId && !mainLayerDetails) {
      dispatch(fetchLayerAction(mainId));
    }

    if (compareId && !compareLayerDetails) {
      dispatch(fetchLayerAction(compareId));
    }
  }, [dispatch, mainId, mainLayerDetails, compareId, compareLayerDetails]);

  return null;
};

export default LayerLoader;
