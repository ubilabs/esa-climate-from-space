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
    rowCount: Math.floor(window.innerHeight / 16),
    columnCount: Math.floor(window.innerWidth / 16)
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        rowCount: Math.floor(window.innerHeight / 16),
        columnCount: Math.floor(window.innerWidth / 16)
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {rowCount, columnCount} = dimensions;
  console.log('🚀 ~ rowCount:', rowCount);
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
    'Sea Surface Wind',
    'Sea Surface Chlorophyll',
    'Sea Surface Oxygen',
    'Sea Surface Phosphate',
    'Sea Surface Waves',
    'Sea Surface Middle Element Phosphate',
    'Sea Surface Oxygen',
    'Sea Surface Chlorophyll',
    'Sea Surface Wind'
    // 'Sea Surface Nitrate'
  ];

  return (
    <div className={styles.dataViewer}>
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
      <ol className={styles.contentNav}>
        {seaSurfaceItems.map((item, index) => {
          const itemCount = Math.min(11, seaSurfaceItems.length);

          //   Any point on the circle can be calculated using

          //   x = r * cos(θ)
          //   y = r * sin(θ)

          //  The right half of a circle spans from -90° to 90°, or
          // -π/2 to π/2

          const middleIndex = Math.floor(itemCount / 2);
          const radius = 10;

          // The purpose of this code is to calculate the angle for each item
          // in a list such that the items are distributed along a curve (specifically, a half-circle) with the middle item at the center. The angle is used to position the items in a visually appealing way, creating a curved layout.
          // This variable is a normalized value that ranges from -1 to 1. It represents the relative position of the current item
          // with respect to the middle item.

          //  This approach ensures that the items are evenly distributed along the curve,
          // with the middle item being at the center and the other items spreading out symmetrically on either side.
          const normalizedPosition = (index - middleIndex) / middleIndex;
          const angle = normalizedPosition * (Math.PI / 2); // Reduced spread to tighten spacing
          //   const angle = (index / itemCount) * Math.PI; // Calculate angle for each item (half-circle)

          const startX = 0; // Center X of the grid
          const startY = rowCount / 2; // Center Y of the grid

          // Calculate position along the right half-circle
          const gridColumnStart = Math.max(
            1,
            Math.round(startX + radius * Math.cos(angle))
          );

          const gridRowStart = Math.round(startY + radius * Math.sin(angle));

          const ROTATION_DEGREE = 12;
          const rotation =
            (index - Math.floor(itemCount / 2)) * ROTATION_DEGREE;

          const opacity = 1 - Math.abs(index - Math.floor(itemCount / 2)) / 5;
          return (
            <li
              key={index}
              style={{
                gridRowStart,
                gridColumnStart,
                transform: `rotate(${rotation}deg)`,
                opacity: `${opacity}`
              }}>
              {item}
            </li>
          );
        })}
      </ol>
      <div className={styles.horizontalLine}></div>
      <div className={styles.verticalLine}></div>
      {/*
        <button onClick={moveGlobe} data-direction="up" style={{zIndex: 1}}>
          ↑
        </button>
        <button onClick={moveGlobe} data-direction="down" style={{zIndex: 1}}>
          ↓
        </button>
        <button onClick={moveGlobe} data-direction="right" style={{zIndex: 1}}>
          →
        </button>
        <button onClick={moveGlobe} data-direction="left" style={{zIndex: 1}}>
          ←
        </button> */}

      {/* {compareLayer &&
            getDataWidget({
              imageLayer: compareImageLayer,
              layerDetails: compareLayerDetails,
              active: !isMainActive,
              action: () => setIsMainActive(false)
            })}
          {!hideNavigation && showGlobeNavigation && (
            <GlobeNavigation mainLayer={mainLayer} compareLayer={compareLayer} />
          )} */}
    </div>
  );
};

export default DataViewer;
