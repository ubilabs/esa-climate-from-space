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
    'Sea Surface Middle Element Waves',
    'Sea Surface Phosphate',
    'Sea Surface Oxygen',
    'Sea Surface Chlorophyll'
    // 'Sea Surface Wind'
    // 'Sea Surface Nitrate',
    // 'Sea Surface Silicate'
    // 'Sea Surface Ice',
    // 'Sea Surface Temperature',
    // 'Sea Surface Salinity',
    // 'Sea Surface Currents',
    // 'Sea Surface Waves',
    // 'Sea Surface Middle Element Wind',
    // 'Sea Surface Chlorophyll',
    // 'Sea Surface Oxygen',
    // 'Sea Surface Phosphate',
    // 'Sea Surface Nitrate',
    // 'Sea Surface Silicate'
  ];

  return (
    <div className={styles.dataViewer}>
      {/* {legend && getLegends()} */}

      {/* <div
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
      </div> */}
      <ol className={styles.contentNav}>
        {seaSurfaceItems.map((item, index) => {
          // There should be 0 offset at postion 12
          // at position 11 and 13, offset should be 10px

          // Row Count equals the window.with divided by the the font size
          // const ROW_COUNT = Math.floor();

          // We would need a resize event listener to update the ROW_COUNT
          const ROW_COUNT = Math.floor(window.innerHeight / 16);
          //   console.log('🚀 ~ ROW_COUNT:', ROW_COUNT);
          const COLUMN_COUNT = Math.floor(window.innerWidth / 16 / 0.1);

          const itemCount = Math.min(11, seaSurfaceItems.length);
          // The amount shown is always restricted to max. 11
          // where the middle element is always at position 6
          // If the amount of items is a odd number, the middle element is at position 6
          // If the amount of items is a even number, the middle element is at position 5
          const isEven = itemCount % 2 === 0;

          const gridRowStart =
            (ROW_COUNT - (itemCount - (isEven ? 0 : 1)) * 2) / 2 + index * 2;

          //   const gridColumnStart = Math.ceil(
          //     ROW_COUNT / 2 - Math.abs(gridRowStart - ROW_COUNT / 2)
          //   );

          //   const gridRowStart =
          //     ROW_COUNT / 2 - Math.floor(itemCount / 2) + index;

          // The middle item will be the furtherst away from the center

          const middlePosition = Math.floor(itemCount / 2);

          const angle = (index / itemCount) * 2 * Math.PI; // Calculate angle for each item
          const radius = 9;
          const x = Math.round(radius * Math.cos(angle));

          //   const gridColumnStart = Math.abs(
          //     (Math.abs(middlePosition - index) - middlePosition) * x
          //   );

          //   const gridColumnStart = Math.round(COLUMN_COUNT / 2 + -x);
          const gridColumnStart = Math.round(COLUMN_COUNT / 2 + -x);

          //   console.log('🚀 ~ gridColumnStart:', gridColumnStart);
          //   const gridColumnStart = Math.abs(index - Math.floor(itemCount / 2));
          //   console.log(
          //     '🚀 ~ {seaSurfaceItems.map ~ gridColumnStart:',
          //     gridColumnStart
          //   );

          //   console.log('🚀 ~ gridColumnStart:', gridColumnStart);

          const ROTATION_DEGREE = 12;
          const rotation =
            (index - Math.floor(itemCount / 2)) * ROTATION_DEGREE;
          //   const rotation = 0;

          const opacity =
            1 - Math.abs(index - Math.floor(itemCount / 2)) / middlePosition;
          //   const opacity = 1;

          //   console.log('🚀 ~ {seaSurfaceItems.map ~ opacity:', opacity);
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
