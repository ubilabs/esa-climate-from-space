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
  const selectedLayerds = useSelector(selectedLayerIdsSelector);
  const {main, compare} = selectedLayerds;
  const mainLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, main)
  );
  const compareLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, compare)
  );

  // load layer list on mount
  useEffect(() => {
    dispatch(fetchLayers());
  }, [dispatch]);

  // fetch layer if it is selected and not already downloaded
  useEffect(() => {
    if (main && !mainLayerDetails) {
      dispatch(fetchLayerAction(main));
    }

    if (compare && !compareLayerDetails) {
      dispatch(fetchLayerAction(compare));
    }
  }, [dispatch, main, mainLayerDetails, compare, compareLayerDetails]);

  return null;
};

export default LayerLoader;
