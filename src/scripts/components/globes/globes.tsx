import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback
} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {layerListItemSelector} from '../../selectors/layers/list-item';
import {globeViewSelector} from '../../selectors/globe/view';
import {timeSelector} from '../../selectors/globe/time';
import {projectionSelector} from '../../selectors/globe/projection';
import {flyToSelector} from '../../selectors/fly-to';
import setGlobeViewAction from '../../actions/set-globe-view';
import Globe from '../globe/globe';
import {getLayerTileUrl} from '../../libs/get-layer-tile-url';
import {State} from '../../reducers';
import {layerDetailsSelector} from '../../selectors/layers/layer-details';
import {selectedLayerIdsSelector} from '../../selectors/layers/selected-ids';

import {GlobeView} from '../../types/globe-view';

import styles from './globes.styl';

const Globes: FunctionComponent = () => {
  const dispatch = useDispatch();
  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const projectionState = useSelector(projectionSelector);
  const globalGlobeView = useSelector(globeViewSelector);
  const {main, compare} = selectedLayerIds;
  const mainLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, main)
  );
  const compareLayer = useSelector((state: State) =>
    layerListItemSelector(state, compare)
  );
  const compareLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, compare)
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
        active={isMainActive}
        layerType={mainLayerDetails?.type}
        view={currentView}
        projectionState={projectionState}
        imageUrl={mainImageUrl}
        flyTo={flyTo}
        onMouseEnter={() => setIsMainActive(true)}
        onChange={onChangeHandler}
        onMoveEnd={onMoveEndHandler}
      />

      {compareLayer && (
        <Globe
          active={!isMainActive}
          layerType={compareLayerDetails?.type}
          view={currentView}
          projectionState={projectionState}
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
