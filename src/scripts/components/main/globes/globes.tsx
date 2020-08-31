import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {layerListItemSelector} from '../../../selectors/layers/list-item';
import {globeViewSelector} from '../../../selectors/globe/view';
import {timeSelector} from '../../../selectors/globe/time';
import {projectionSelector} from '../../../selectors/globe/projection';
import {flyToSelector} from '../../../selectors/fly-to';
import setGlobeViewAction from '../../../actions/set-globe-view';
import Globe from '../globe/globe';
import LayerLegend from '../../layers/layer-legend/layer-legend';
import {getImageLayerData} from '../../../libs/get-image-layer-data';
import {State} from '../../../reducers';
import {layerDetailsSelector} from '../../../selectors/layers/layer-details';
import {selectedLayerIdsSelector} from '../../../selectors/layers/selected-ids';
import {globeSpinningSelector} from '../../../selectors/globe/spinning';

import {GlobeView} from '../../../types/globe-view';
import {Marker} from '../../../types/marker-type';

import styles from './globes.styl';
import setGlobeSpinningAction from '../../../actions/set-globe-spinning';

interface Props {
  backgroundColor: string;
  markers?: Marker[];
}

// eslint-disable-next-line complexity
const Globes: FunctionComponent<Props> = ({backgroundColor, markers = []}) => {
  const dispatch = useDispatch();
  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const projectionState = useSelector(projectionSelector);
  const globalGlobeView = useSelector(globeViewSelector);
  const globeSpinning = useSelector(globeSpinningSelector);
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

  const onMouseDownHandler = useCallback(
    () => globeSpinning && dispatch(setGlobeSpinningAction(false)),
    [dispatch, globeSpinning]
  );

  const mainImageLayer = useMemo(
    () => getImageLayerData(mainLayerDetails, time),
    [mainLayerDetails, time]
  );
  const compareImageLayer = useMemo(
    () => getImageLayerData(compareLayerDetails, time),
    [compareLayerDetails, time]
  );

  // apply changes in the app state view to our local view copy
  // we don't use the app state view all the time to keep store updates low
  useEffect(() => {
    setCurrentView(globalGlobeView);
  }, [globalGlobeView]);

  const mainLegendValues = mainLayerDetails?.legendValues || [
    mainLayerDetails?.maxValue || 0,
    mainLayerDetails?.minValue || 0
  ];
  const compareLegendValues = compareLayerDetails?.legendValues || [
    compareLayerDetails?.maxValue || 0,
    compareLayerDetails?.minValue || 0
  ];

  return (
    <div className={styles.globes}>
      {mainLayerDetails && (
        <LayerLegend
          id={mainLayerDetails.id}
          values={mainLegendValues}
          unit={mainLayerDetails.units}
        />
      )}
      {compareLayerDetails && (
        <LayerLegend
          id={compareLayerDetails.id}
          values={compareLegendValues}
          unit={compareLayerDetails.units}
          isCompare={true}
        />
      )}
      <Globe
        markers={markers}
        backgroundColor={backgroundColor}
        active={isMainActive}
        view={currentView}
        projectionState={projectionState}
        imageLayer={mainImageLayer}
        basemap={mainLayerDetails?.basemap || null}
        spinning={globeSpinning}
        flyTo={flyTo}
        onMouseEnter={() => setIsMainActive(true)}
        onTouchStart={() => setIsMainActive(true)}
        onChange={onChangeHandler}
        onMoveEnd={onMoveEndHandler}
        onMouseDown={onMouseDownHandler}
      />

      {compareLayer && (
        <Globe
          backgroundColor={backgroundColor}
          active={!isMainActive}
          view={currentView}
          projectionState={projectionState}
          imageLayer={compareImageLayer}
          basemap={compareLayerDetails?.basemap || null}
          spinning={globeSpinning}
          flyTo={flyTo}
          onMouseEnter={() => setIsMainActive(false)}
          onTouchStart={() => setIsMainActive(false)}
          onChange={onChangeHandler}
          onMoveEnd={onMoveEndHandler}
          onMouseDown={onMouseDownHandler}
        />
      )}
    </div>
  );
};

export default Globes;
