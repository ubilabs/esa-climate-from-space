import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback
} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {matchPath, useLocation} from 'react-router';

import {layerListItemSelector} from '../../selectors/layers/list-item';
import {globeViewSelector} from '../../selectors/globe/view';
import {timeSelector} from '../../selectors/globe/time';
import {projectionSelector} from '../../selectors/globe/projection';
import {flyToSelector} from '../../selectors/fly-to';
import {storyLayerSelector} from '../../selectors/story-layer';
import setGlobeViewAction from '../../actions/set-globe-view';
import Globe from '../globe/globe';
import {getLayerTileUrl} from '../../libs/get-layer-tile-url';
import {State} from '../../reducers';
import {layerDetailsSelector} from '../../selectors/layers/layer-details';

import {GlobeView} from '../../types/globe-view';

import styles from './globes.styl';

const Globes: FunctionComponent = () => {
  const location = useLocation();
  const match = matchPath<{mainLayerId?: string; compareLayerId?: string}>(
    location.pathname,
    {
      path: ['/layers/:mainLayerId?/:compareLayerId?', '/'],
      exact: true
    }
  );
  const dispatch = useDispatch();
  const projection = useSelector(projectionSelector);
  const globalGlobeView = useSelector(globeViewSelector);
  const storyLayerId = useSelector(storyLayerSelector);
  const mainLayerId = match?.params.mainLayerId || storyLayerId;
  const main = useSelector((state: State) =>
    layerListItemSelector(state, mainLayerId)
  );
  const mainLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, mainLayerId)
  );

  const compareLayerId = match?.params.compareLayerId;
  const compare = useSelector((state: State) =>
    layerListItemSelector(state, compareLayerId)
  );
  const compareLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, compareLayerId)
  );

  const time = useSelector(timeSelector);
  const [currentView, setCurrentView] = useState(globalGlobeView);
  const [isMainActive, setIsMainActive] = useState(true);
  const flyTo = useSelector(flyToSelector);
  const onChangeHandler = useCallback(
    (view: GlobeView) => setCurrentView(view),
    []
  );
  const onMoveEndHandler = useCallback(
    (view: GlobeView) => dispatch(setGlobeViewAction(view)),
    [dispatch]
  );

  const mainImageUrl = getLayerTileUrl(mainLayerDetails, time);
  const compareImageUrl = getLayerTileUrl(compareLayerDetails, time);

  // apply changes in the app state view to our local view copy
  // we don't use the app state view all the time to keep store updates low
  useEffect(() => {
    setCurrentView(globalGlobeView);
  }, [globalGlobeView]);

  return (
    <div className={styles.globes}>
      <Globe
        layer={main}
        active={isMainActive}
        isMain
        view={currentView}
        projection={projection}
        imageUrl={mainImageUrl}
        flyTo={flyTo}
        onMouseEnter={() => setIsMainActive(true)}
        onChange={onChangeHandler}
        onMoveEnd={onMoveEndHandler}
      />

      {compare && (
        <Globe
          layer={compare}
          active={!isMainActive}
          view={currentView}
          projection={projection}
          imageUrl={compareImageUrl}
          flyTo={flyTo}
          onMouseEnter={() => setIsMainActive(false)}
          onChange={onChangeHandler}
          onMoveEnd={onMoveEndHandler}
        />
      )}
    </div>
  );
};

export default Globes;
