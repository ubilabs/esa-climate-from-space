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
import Gallery from '../gallery/gallery';
import LayerLegend from '../../layers/layer-legend/layer-legend';
import {getImageLayerData} from '../../../libs/get-image-layer-data';
import {State} from '../../../reducers';
import {layerDetailsSelector} from '../../../selectors/layers/layer-details';
import {selectedLayerIdsSelector} from '../../../selectors/layers/selected-ids';
import {globeSpinningSelector} from '../../../selectors/globe/spinning';

import {GlobeView} from '../../../types/globe-view';
import {Marker} from '../../../types/marker-type';
import {LayerType} from '../../../types/globe-layer-type';

import styles from './data-viewer.styl';
import setGlobeSpinningAction from '../../../actions/set-globe-spinning';
import GlobeNavigation from '../globe-navigation/globe-navigation';
import {GlobeImageLayerData} from '../../../types/globe-image-layer-data';
import {Layer} from '../../../types/layer';

interface Props {
  backgroundColor: string;
  markers?: Marker[];
}

const DataViewer: FunctionComponent<Props> = ({
  backgroundColor,
  markers = []
}) => {
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

  const showGlobeNavigation = [mainLayerDetails, compareLayerDetails].some(
    layer => layer && layer.type !== LayerType.Gallery
  );

  const getDataWidget = ({
    imageLayer,
    layerDetails,
    active,
    action
  }: {
    imageLayer: GlobeImageLayerData | null;
    layerDetails: Layer | null;
    active: boolean;
    action: () => void;
  }) => {
    if (imageLayer?.type === LayerType.Gallery) {
      return <Gallery imageLayer={imageLayer} />;
    }

    return (
      <Globe
        markers={markers}
        backgroundColor={backgroundColor}
        active={active}
        view={currentView}
        projectionState={projectionState}
        imageLayer={imageLayer}
        basemap={layerDetails?.basemap || null}
        spinning={globeSpinning}
        flyTo={flyTo}
        onMouseEnter={action}
        onTouchStart={action}
        onChange={onChangeHandler}
        onMoveEnd={onMoveEndHandler}
        onMouseDown={onMouseDownHandler}
      />
    );
  };

  return (
    <div className={styles.dataViewer}>
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

      {getDataWidget({
        imageLayer: mainImageLayer,
        layerDetails: mainLayerDetails,
        active: isMainActive,
        action: () => setIsMainActive(true)
      })}

      {compareLayer &&
        getDataWidget({
          imageLayer: compareImageLayer,
          layerDetails: compareLayerDetails,
          active: !isMainActive,
          action: () => setIsMainActive(false)
        })}

      {showGlobeNavigation && <GlobeNavigation />}
    </div>
  );
};

export default DataViewer;
