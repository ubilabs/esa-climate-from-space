import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useMemo
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
import globe from '../globe/globe';

interface Props {
  backgroundColor: string;
  hideNavigation?: boolean;
  markers?: Marker[];
}

const DataViewer: FunctionComponent<Props> = ({
  backgroundColor,
  hideNavigation,
  markers = []
}) => {
  const [dimensions, setDimensions] = useState({
    rowCount: Math.floor(window.innerHeight),
    columnCount: Math.floor(window.innerWidth)
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        rowCount: Math.floor(window.innerHeight),
        columnCount: Math.floor(window.innerWidth)
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {rowCount, columnCount} = dimensions;
  console.log('🚀 ~ columnCount:', columnCount);
  //   console.log('🚀 ~ rowCount:', rowCount);
  const dispatch = useDispatch();
  const {legend} = useSelector(embedElementsSelector);

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

  function moveGlobe(event: React.MouseEvent<HTMLButtonElement>) {
    const MOVE_STEP = 20;
    // Get data-direction attribute from button
    const direction = event.currentTarget.getAttribute('data-direction');
    // console.log('🚀 ~ moveGlobe ~ direction:', direction);

    const globeEl = document.querySelector('#globeWrapper') as HTMLElement;
    // console.log('🚀 ~ moveGlobe ~ globeEl:', globeEl);

    const currentX = globeEl.getAttribute('data-x');
    // console.log('🚀 ~ moveGlobe ~ currentX:', currentX);
    const currentY = globeEl.getAttribute('data-y');
    // console.log('🚀 ~ moveGlobe ~ currentY:', currentY);

    // globeEl.classList.toggle(styles[`move`]);

    if (globeEl) {
      //   globeEl.classList.toggle(styles[`move-${direction}`]);
      let updatedY;
      let updatedX;
      switch (direction) {
        case 'up':
          updatedY = Number(currentY) - MOVE_STEP;
          globeEl.setAttribute('data-y', `${updatedY}`);
          globeEl.style.transform = `translate3d(${currentX}px, ${updatedY}px, 0)`;
          break;
        case 'down':
          updatedY = Number(currentY) + MOVE_STEP;
          globeEl.setAttribute('data-y', `${updatedY}`);
          globeEl.style.transform = `translate3d(${currentX}px, ${updatedY}px, 0)`;
          break;
        case 'right':
          updatedX = Number(currentX) + MOVE_STEP;
          globeEl.setAttribute('data-x', `${updatedX}`);
          globeEl.style.transform = `translate3d(${updatedX}px, ${currentY}px, 0)`;
          break;
        case 'left':
          updatedX = Number(currentX) - MOVE_STEP;
          globeEl.setAttribute('data-x', `${updatedX}`);
          globeEl.style.transform = `translate3d(${updatedX}px, ${currentY}px, 0)`;
          break;
        default:
          break;
      }
      // globeEl.style.transform = `translate3d(0, 0, 0)`;
    }
  }

  const seaSurfaceItems = [
    'Sea Surface Wind 1',
    'Sea Surface Wind 2',
    'Sea Surface ',
    'Sea Surface Wind 1',
    'Sea Surface ',
    'Sea Surface Wind 2',
    'Sea Surface ',
    'Sea Surface ',
    'Sea Surface Wind '
    // 'Sea Surface Wind ',
    // 'Sea Surface ',
    // 'Sea Surface Wind',
    // 'Sea Surface Wind ',
    // 'Sea Surface ',
    // 'Sea Surface Wind ',
    // 'Sea Surface ',
    // 'Sea Surface Wind '
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Wind 1',
    // 'Sea Surface Wind 2',
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Wind 1',
    // 'Sea Surface Wind 2',
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Wind 1',
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Wind 2',
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Wind 1',
    // 'Sea Surface Wind 2',
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Wind 1',
    // 'Sea Surface Wind 2',
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Wind 1',
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Wind 2',
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Wind 1',
    // 'Sea Surface Wind 2',
    // 'Sea Surface Chlorophyll'
    // 'Sea Surface Wind 1',
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Wind 2',
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Chlorophyll'
  ];

  const RADIUS = Math.round(rowCount / 4);
  const ROTATION_DEGREE = 12;
  const OPACITY_FACTOR = 8;
  //   const startX = -24; // Center X of the grid
  const startX = -64; // Center X of the grid
  //   console.log('🚀 ~ startX:', startX);
  const startY = rowCount / 2 + 1; // Center Y of the grid
  //   console.log('🚀 ~ rowCount:', rowCount);

  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(
    Math.floor(seaSurfaceItems.length / 2)
  );
  const itemCount = Math.min(seaSurfaceItems.length);

  const [rotation, setRotation] = useState(0);

  function calculateGridCoordinates(relativePosition: number) {
    //   Any point on the circle can be calculated using
    //   x = r * cos(θ)
    //   y = r * sin(θ)

    // Our CSS property expects a rotation value in degrees, which is why
    // we convert angle from degrees to radians
    const angle = relativePosition * ROTATION_DEGREE * (Math.PI / 180); // Reduced spread to tighten spacing

    // Calculate position along the right half-circle
    const gridColumnStart = Math.max(
      1,
      Math.round(startX + RADIUS * Math.cos(angle))
    );

    const gridRowStart = Math.max(
      1,
      Math.round(startY + RADIUS * Math.sin(angle))
    );

    return {
      gridColumnStart,
      gridRowStart
    };
  }

  const rotateList = (e: React.TouchEvent) => {
    // e.preventDefault();

    if (!touchStartY) {
      setTouchStartY(e.touches[0].clientY);
      return;
    }

    const touchDelta = e.touches[0].clientY - touchStartY;
    const itemHeight = 32; // Height of each item in pixels
    const sensitivity = 0.51; // Adjust this to control movement sensitivity

    // Calculate new index based on touch movement
    const indexDelta = Math.round((touchDelta * sensitivity) / itemHeight);
    setRotation(indexDelta);
  };

  const relativePositionToCenter = (index: number, count: number) =>
    index - Math.floor(count / 2);

  const handleTouchEnd = () => {
    setTouchStartY(null);

    // Snap to the closest middle position
    const closestIndex = Math.round(currentIndex / 2) * 2;
    setCurrentIndex(closestIndex);
  };

  return (
    <div className={styles.dataViewer}>
      <span
        style={{
          gridColumnStart: startX,
          gridRowStart: startY,
          backgroundColor: 'red',
          height: '1px',
          width: '1px'
        }}></span>
      {/* {legend && getLegends()} */}

      <div
        id="globeWrapper"
        className={styles.globeWrapper}
        data-x="0"
        data-y="0">
        {getDataWidget({
          imageLayer: mainImageLayer,
          layerDetails: mainLayerDetails,
          active: isMainActive,
          action: () => setIsMainActive(true)
        })}
      </div>
      <ul
        className={styles.contentNav}
        onTouchMove={rotateList}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          rotate: `${rotation * ROTATION_DEGREE}deg`,
          transformOrigin: '0 50%',
          transition: 'all 0.3s ease-out'
        }}>
        {' '}
        {seaSurfaceItems.map((item, index) => {
          const relativePosition = relativePositionToCenter(index, itemCount);

          const {gridColumnStart, gridRowStart} =
            calculateGridCoordinates(relativePosition);

          const ROTATION_DEGREE = 12;
          const rotation =
            (index - Math.floor(itemCount / 2)) * ROTATION_DEGREE;

          const opacity =
            1 - Math.abs(index - Math.floor(itemCount / 2)) / OPACITY_FACTOR;

          return (
            <li
              data-relative-position={relativePosition}
              className={
                styles.contentNavItem
                // index === Math.floor(itemCount / 2) ? styles.active : ''
              }
              key={index}
              style={{
                opacity,
                gridRowStart,
                gridColumnStart,
                rotate: `${rotation}deg`,
                transition: 'all 0.3s ease-out',
                transformOrigin: '0 50%'
              }}>
              {item}
            </li>
          );
        })}
      </ul>

      {/* <div className={styles.horizontalLine}></div>
      <div className={styles.verticalLine}></div> */}
    </div>
  );
};

export default DataViewer;
