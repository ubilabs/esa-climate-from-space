import {FunctionComponent, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {matchPath, useLocation} from 'react-router';

import fetchLayers from '../../actions/fetch-layers';
import fetchLayerAction from '../../actions/fetch-layer';
import {State} from '../../reducers';
import {layerDetailsSelector} from '../../selectors/layers/layer-details';
import {storyLayerSelector} from '../../selectors/story-layer';

/**
 * Handles loading of layer list and layer details data
 */
const LayerLoader: FunctionComponent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const match = matchPath<{mainLayerId?: string; compareLayerId?: string}>(
    location.pathname,
    {
      path: ['/layers/:mainLayerId?/:compareLayerId?'],
      exact: true
    }
  );
  const storyLayerId = useSelector(storyLayerSelector);
  const mainLayerId = match?.params.mainLayerId || storyLayerId;
  const compareLayerId = match?.params.compareLayerId;
  const mainLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, mainLayerId)
  );
  const compareLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, compareLayerId)
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
