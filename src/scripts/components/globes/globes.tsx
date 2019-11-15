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
import setGlobeViewAction from '../../actions/set-globe-view';
import Globe from '../globe/globe';
import {getLayerTileUrl} from '../../libs/get-layer-tile-url';
import {flyToSelector} from '../../selectors/fly-to';
import {State} from '../../reducers';

import {GlobeView} from '../../types/globe-view';

import styles from './globes.styl';
import {layerDetailsSelector} from '../../selectors/layers/layer-details';

const Globes: FunctionComponent = () => {
  const location = useLocation();
  const match = matchPath(location.pathname, {
    path: '(/|/layers)/:mainLayerId?/:compareLayerId?',
    exact: true
  });
  const dispatch = useDispatch();
  const projection = useSelector(projectionSelector);
  const globalGlobeView = useSelector(globeViewSelector);
  const {main, compare} = useSelector((state: State) =>
    layerListItemSelector(state, match && match.params)
  );
  const {mainLayerDetails, compareLayerDetails} = useSelector((state: State) =>
    layerDetailsSelector(state, match && match.params)
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
