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
import LayerLegend from '../layer-legend/layer-legend';
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
  const {mainId, compareId} = selectedLayerIds;
  const mainLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, mainId)
  );
  const compareLayer = useSelector((state: State) =>
    layerListItemSelector(state, compareId)
  );
  const compareLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, compareId)
  );

  const time = useSelector(timeSelector);
  const [currentView, setCurrentView] = useState(globalGlobeView);
  const [isMainActive, setIsMainActive] = useState(true);
  const flyTo = useSelector(flyToSelector);
  const onChangeHandler = useCallback((view: GlobeView) => {
    setCurrentView(view);
    // setting css variable for compass icon
    document.documentElement.style.setProperty(
      '--globe-latitude',
      `${view.position.latitude}deg`
    );
  }, []);

  const onMoveEndHandler = useCallback(
    (view: GlobeView) => dispatch(setGlobeViewAction(view)),
    [dispatch]
  );

  const mainTilesUrl = getLayerTileUrl(mainLayerDetails, time);
  const compareTilesUrl = getLayerTileUrl(compareLayerDetails, time);

  // apply changes in the app state view to our local view copy
  // we don't use the app state view all the time to keep store updates low
  useEffect(() => {
    setCurrentView(globalGlobeView);
  }, [globalGlobeView]);

  return (
    <div className={styles.globes}>
      {mainLayerDetails && (
        <LayerLegend
          id={mainLayerDetails.id}
          values={[mainLayerDetails.maxValue, mainLayerDetails.minValue]}
          unit={mainLayerDetails.units}
        />
      )}
      {compareLayerDetails && (
        <LayerLegend
          id={compareLayerDetails.id}
          values={[compareLayerDetails.maxValue, compareLayerDetails.minValue]}
          unit={compareLayerDetails.units}
          isCompare={true}
        />
      )}
      <Globe
        active={isMainActive}
        view={currentView}
        projectionState={projectionState}
        tilesUrl={mainTilesUrl}
        basemap={mainLayerDetails?.basemap || null}
        zoomLevels={mainLayerDetails?.zoomLevels || 0}
        flyTo={flyTo}
        onMouseEnter={() => setIsMainActive(true)}
        onTouchStart={() => setIsMainActive(true)}
        onChange={onChangeHandler}
        onMoveEnd={onMoveEndHandler}
      />

      {compareLayer && (
        <Globe
          active={!isMainActive}
          view={currentView}
          projectionState={projectionState}
          tilesUrl={compareTilesUrl}
          basemap={compareLayerDetails?.basemap || null}
          zoomLevels={compareLayerDetails?.zoomLevels || 0}
          flyTo={flyTo}
          onMouseEnter={() => setIsMainActive(false)}
          onTouchStart={() => setIsMainActive(false)}
          onChange={onChangeHandler}
          onMoveEnd={onMoveEndHandler}
        />
      )}
    </div>
  );
};

export default Globes;
