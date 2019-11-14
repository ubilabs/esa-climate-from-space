import {FunctionComponent, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useParams} from 'react-router';

import fetchLayers from '../../actions/fetch-layers';
import fetchLayerAction from '../../actions/fetch-layer';
import {detailedLayersSelector} from '../../selectors/layers/details';

/**
 * Handles loading of layer list and layer details data
 */
const LayerLoader: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {mainLayerId, compareLayerId} = useParams();
  const detailedLayers = useSelector(detailedLayersSelector);

  // load layer list on mount
  useEffect(() => {
    dispatch(fetchLayers());
  }, [dispatch]);

  // fetch layer if it is selected and not already downloaded
  useEffect(() => {
    if (mainLayerId && !detailedLayers[mainLayerId]) {
      dispatch(fetchLayerAction(mainLayerId));
    }

    if (compareLayerId && !detailedLayers[compareLayerId]) {
      dispatch(fetchLayerAction(compareLayerId));
    }
  }, [dispatch, detailedLayers, mainLayerId, compareLayerId]);

  return null;
};

export default LayerLoader;
