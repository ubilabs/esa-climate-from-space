import {FunctionComponent, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import fetchLayers from '../../actions/fetch-layers';
import fetchLayerAction from '../../actions/fetch-layer';
import {selectedLayerIdsSelector} from '../../selectors/layers/selected-ids';
import {detailedLayersSelector} from '../../selectors/layers/details';

/**
 * Handles loading of layer list and layer details data
 */
const LayerLoader: FunctionComponent = () => {
  const dispatch = useDispatch();
  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const detailedLayers = useSelector(detailedLayersSelector);

  // load layer list on mount
  useEffect(() => {
    dispatch(fetchLayers());
  }, [dispatch]);

  // fetch layer if it is selected and not already downloaded
  useEffect(() => {
    const {main, compare} = selectedLayerIds;

    if (main && !detailedLayers[main]) {
      dispatch(fetchLayerAction(main));
    }

    if (compare && !detailedLayers[compare]) {
      dispatch(fetchLayerAction(compare));
    }
  }, [dispatch, selectedLayerIds, detailedLayers]);

  return null;
};

export default LayerLoader;
