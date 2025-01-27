import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect
} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {CameraView, LayerLoadingState} from '@ubilabs/esa-webgl-globe';

import {layerListItemSelector} from '../../../selectors/layers/list-item';
import {globeViewSelector} from '../../../selectors/globe/view';
import {timeSelector} from '../../../selectors/globe/time';
import {projectionSelector} from '../../../selectors/globe/projection';
import {flyToSelector} from '../../../selectors/fly-to';
import {layerDetailsSelector} from '../../../selectors/layers/layer-details';
import {selectedLayerIdsSelector} from '../../../selectors/layers/selected-ids';
import {globeSpinningSelector} from '../../../selectors/globe/spinning';
import setGlobeViewAction from '../../../actions/set-globe-view';
import setGlobeSpinningAction from '../../../actions/set-globe-spinning';
import updateLayerLoadingStateAction from '../../../actions/update-layer-loading-state';
import {State} from '../../../reducers';
import Globe from '../globe/globe';
import Gallery from '../gallery/gallery';
import GlobeNavigation from '../globe-navigation/globe-navigation';
import LayerLegend from '../../layers/layer-legend/layer-legend';
import {useImageLayerData} from '../../../hooks/use-image-layer-data';
import HoverLegend from '../../layers/hover-legend/hover-legend';

import {Marker} from '../../../types/marker-type';
import {LayerType} from '../../../types/globe-layer-type';
import {GlobeImageLayerData} from '../../../types/globe-image-layer-data';
import {Layer} from '../../../types/layer';
import {LegendValueColor} from '../../../types/legend-value-color';
import {embedElementsSelector} from '../../../selectors/embed-elements-selector';

import styles from './data-viewer.module.css';

interface Props {
  backgroundColor: string;
  hideNavigation?: boolean;
}

const DataViewer: FunctionComponent<Props> = ({
  backgroundColor,
  hideNavigation
}) => {
  const dispatch = useDispatch();
  const {legend} = useSelector(embedElementsSelector);

  const [dimensions, setDimensions] = useState({
    rowCount: Math.floor(window.innerHeight) / 16,
    columnCount: Math.floor(window.innerWidth) / 16
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        rowCount: Math.floor(window.innerHeight) / 16,
        columnCount: Math.floor(window.innerWidth) / 16
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //   const {rowCount, columnCount} = dimensions;

  //   const startX = Math.floor(columnCount / 2);

  //   const startY = Math.floor(rowCount / 16);
  const startY = 0;

  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const projectionState = useSelector(projectionSelector);
  const globalGlobeView = useSelector(globeViewSelector);
  const globeSpinning = useSelector(globeSpinningSelector);
  const {mainId, compareId} = selectedLayerIds;
  const mainLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, mainId)
  );
  const mainLayer = useSelector((state: State) =>
    layerListItemSelector(state, mainId)
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
  const onChangeHandler = useCallback((view: CameraView) => {
    setCurrentView(view);
    // setting css variable for compass icon
    document.documentElement.style.setProperty(
      '--globe-latitude',
      `${view.lat}deg`
    );
  }, []);

  const onMoveStartHandler = useCallback(
    () => globeSpinning && dispatch(setGlobeSpinningAction(false)),
    [dispatch, globeSpinning]
  );

  const onMoveEndHandler = useCallback(
    (view: CameraView) => dispatch(setGlobeViewAction(view)),
    [dispatch]
  );

  const onLayerLoadingStateChangeHandler = useCallback(
    (layerId: string, loadingState: LayerLoadingState) =>
      dispatch(updateLayerLoadingStateAction(layerId, loadingState)),
    [dispatch]
  );

  const mainImageLayer = useImageLayerData(mainLayerDetails, time);
  const compareImageLayer = useImageLayerData(compareLayerDetails, time);

  // apply changes in the app state view to our local view copy
  // we don't use the app state view all the time to keep store updates low
  useLayoutEffect(() => {
    setCurrentView(globalGlobeView);
  }, [globalGlobeView]);

  // stop globe spinning when layer is selected
  useEffect(() => {
    if ((mainId || compareId) && globeSpinning) {
      dispatch(setGlobeSpinningAction(false));
    }
  }, [dispatch, mainId, compareId, globeSpinning]);

  // Only show the globe navigation when a globe is shown.
  // Either when no data layer is selected and only basemap is shown
  // or when one of the selected layers is a globe. Do not show globe navigation
  // when the only visible layer is of type "gallery"
  const showGlobeNavigation =
    (!mainLayerDetails && !compareLayerDetails) ||
    [mainLayerDetails, compareLayerDetails].some(
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
        backgroundColor={backgroundColor}
        active={active}
        view={currentView}
        projectionState={projectionState}
        imageLayer={imageLayer}
        layerDetails={layerDetails || null}
        spinning={globeSpinning}
        flyTo={flyTo}
        onMouseEnter={action}
        onTouchStart={action}
        onChange={onChangeHandler}
        onMoveStart={onMoveStartHandler}
        onMoveEnd={onMoveEndHandler}
        onLayerLoadingStateChange={onLayerLoadingStateChangeHandler}
      />
    );
  };

  const getLegends = () =>
    [mainLayerDetails, compareLayerDetails]
      .filter((layer): layer is Layer => Boolean(layer))
      .map(
        (
          {id, maxValue, minValue, units, basemap, legendValues, hideLegend},
          index
        ) => {
          if (hideLegend) {
            return null;
          }

          return id === 'land_cover.lccs_class' || id === 'land_cover.class' ? (
            <HoverLegend
              key={id}
              values={legendValues as LegendValueColor[]}
              isCompare={index > 0}
            />
          ) : (
            <LayerLegend
              key={id}
              id={id}
              values={
                (legendValues as string[]) || [maxValue || 0, minValue || 0]
              }
              unit={units}
              basemap={basemap}
              isCompare={index > 0}
            />
          );
        }
      );

  const seaSurfaceItems = [
    'Sea Surface Wind 1',
    'Sea Surface Wind 2',
    'Sea Surface Sea',
    'Sea Surface Wind 1',
    'Sea Surface Sea',
    'Sea Surface Wind 2',
    'Sea Surface ',
    'Sea Surface ',
    'Sea Surface Wind ',
    'Sea Surface Wind ',
    'Sea Surface ',
    'Sea Surface Wind',
    'Sea Surface Wind ',
    'Sea Surface ',
    'Sea Surface Wind ',
    'Sea Surface ',
    'Sea Surface Wind ',
    'Sea Surface Chlorophyll'
  ];

  const OPACITY_FACTOR = 6;
  const ANGLE_BETWEEN_ELEMENTS = 12;

  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [indexDelta, setIndexDelta] = useState(0);

  function computeCartesianCoordinates(radius: number, angleInDegrees: number) {
    const angleInRadians = angleInDegrees * (Math.PI / 180);

    const x = radius * Math.cos(angleInRadians);
    const y = radius * Math.sin(angleInRadians);

    return {x, y};
  }

  const getCoordinates = useCallback((pos: number) => {
    const _radius = 33;
    const angleInDegrees = pos * ANGLE_BETWEEN_ELEMENTS;
    const {x, y} = computeCartesianCoordinates(_radius, angleInDegrees);

    return {x, y: y + 50};
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY) {
      setTouchStartY(e.touches[0].clientY);
      return;
    }

    const touchDelta = e.touches[0].clientY - touchStartY;

    const itemHeight = 32; // Height of each item in pixels
    const sensitivity = 0.5; // Adjust this to control movement sensitivity

    const delta = Math.round((touchDelta * sensitivity) / itemHeight);

    if (delta !== indexDelta) {
      setIndexDelta(delta);
      setTouchStartY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };

  useEffect(() => {
    const listItems: NodeListOf<HTMLElement> =
      document.querySelectorAll('ul li');

    for (const item of listItems) {
      const relativePosition = Number(
        item.getAttribute('data-relative-position')
      );

      const adjustedPosition = relativePosition + indexDelta;

      const {x, y} = getCoordinates(adjustedPosition);
      const rotation = adjustedPosition * ANGLE_BETWEEN_ELEMENTS;
      const opacity = 1 - Math.abs(adjustedPosition) / OPACITY_FACTOR;

      item.style.top = `${y}%`;
      item.style.left = `${x}%`;
      item.style.opacity = `${opacity}`;
      item.style.rotate = `${rotation}deg`;

      item.setAttribute('data-relative-position', adjustedPosition.toString());
    }
  }, [indexDelta, getCoordinates]);

  const relativePositionToCenter = (index: number, count: number): number =>
    index - Math.floor(count / 2);

  return (
    <div className={styles.dataViewer}>
      {legend && getLegends()}

      <div id="globeWrapper" className={styles.globeWrapper}>
        {getDataWidget({
          imageLayer: mainImageLayer,
          layerDetails: mainLayerDetails,
          active: isMainActive,
          action: () => setIsMainActive(true)
        })}
      </div>
      <ul
        className={styles.contentNav}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}>
        {seaSurfaceItems.map((item, index) => {
          const relativePosition = relativePositionToCenter(
            index,
            seaSurfaceItems.length
          );

          return (
            <li
              data-relative-position={relativePosition}
              className={styles.contentNavItem}
              key={index}>
              {relativePosition} - {item}
            </li>
          );
        })}
      </ul>

      {compareLayer &&
        getDataWidget({
          imageLayer: compareImageLayer,
          layerDetails: compareLayerDetails,
          active: !isMainActive,
          action: () => setIsMainActive(false)
        })}
      {/* {!hideNavigation && showGlobeNavigation && (
        <GlobeNavigation mainLayer={mainLayer} compareLayer={compareLayer} />
      )} */}
    </div>
  );
};

export default DataViewer;
