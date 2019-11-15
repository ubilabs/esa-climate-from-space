import {FunctionComponent, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useParams} from 'react-router';

import fetchLayers from '../../actions/fetch-layers';
import fetchLayerAction from '../../actions/fetch-layer';
import {State} from '../../reducers';
import {layerDetailsSelector} from '../../selectors/layers/layer-details';

/**
 * Handles loading of layer list and layer details data
 */
const LayerLoader: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {mainLayerId, compareLayerId} = useParams();
  const {mainLayerDetails, compareLayerDetails} = useSelector((state: State) =>
    layerDetailsSelector(state, {mainLayerId, compareLayerId})
  );

  // load layer list on mount
  useEffect(() => {
    dispatch(fetchLayers());
  }, [dispatch]);

  // fetch layer if it is selected and not already downloaded
  useEffect(() => {
    if (mainLayerId && !mainLayerDetails) {
      dispatch(fetchLayerAction(mainLayerId));
    }

    if (compareLayerId && !compareLayerDetails) {
      dispatch(fetchLayerAction(compareLayerId));
    }
  }, [
    dispatch,
    mainLayerId,
    mainLayerDetails,
    compareLayerId,
    compareLayerDetails
  ]);

  return null;
};

export default LayerLoader;
