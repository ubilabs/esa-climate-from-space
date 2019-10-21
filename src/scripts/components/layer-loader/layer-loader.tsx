import {FunctionComponent, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import fetchLayers from '../../actions/fetch-layers';
import fetchLayerAction from '../../actions/fetch-layer';
import {selectedLayersSelector} from '../../reducers/layers/selected';
import {detailedLayersSelector} from '../../reducers/layers/details';

/**
 * Handles loading of layer list and layer details data
 */
const LayerLoader: FunctionComponent = () => {
  const dispatch = useDispatch();
  const selectedLayers = useSelector(selectedLayersSelector);
  const detailedLayers = useSelector(detailedLayersSelector);
  const {main, compare} = selectedLayers;

  // load layer list on mount
  useEffect(() => {
    dispatch(fetchLayers());
  }, [dispatch]);

  // fetch layer if it is selected and not already downloaded
  useEffect(() => {
    if (main && !detailedLayers[main]) {
      dispatch(fetchLayerAction(main));
    }

    if (compare && !detailedLayers[compare]) {
      dispatch(fetchLayerAction(compare));
    }
  }, [dispatch, selectedLayers, detailedLayers]);

  return null;
};

export default LayerLoader;
