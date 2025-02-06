import {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { CameraView, LayerLoadingState } from "@ubilabs/esa-webgl-globe";

import { layerListItemSelector } from "../../../selectors/layers/list-item";
import { globeViewSelector } from "../../../selectors/globe/view";
import { timeSelector } from "../../../selectors/globe/time";
import { projectionSelector } from "../../../selectors/globe/projection";
import { flyToSelector } from "../../../selectors/fly-to";
import { layerDetailsSelector } from "../../../selectors/layers/layer-details";
import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";
import { globeSpinningSelector } from "../../../selectors/globe/spinning";
import setGlobeViewAction from "../../../actions/set-globe-view";
import setGlobeSpinningAction from "../../../actions/set-globe-spinning";
import updateLayerLoadingStateAction from "../../../actions/update-layer-loading-state";
import { State } from "../../../reducers";
import Globe from "../globe/globe";
import Gallery from "../gallery/gallery";
import LayerLegend from "../../layers/layer-legend/layer-legend";
import { useImageLayerData } from "../../../hooks/use-image-layer-data";
import HoverLegend from "../../layers/hover-legend/hover-legend";

import { LayerType } from "../../../types/globe-layer-type";
import { GlobeImageLayerData } from "../../../types/globe-image-layer-data";
import { Layer } from "../../../types/layer";
import { LegendValueColor } from "../../../types/legend-value-color";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import styles from "./data-viewer.module.css";
import CategoryNavigation from "../category-navigation/category-navigation";
import Button from "../button/button";
import { useHistory, useParams } from "react-router";

import cx from "classnames";
import ContentNavigation from "../content-navigation/content-navigation";
import { useScreenSize } from "../../../hooks/use-screen-size";
import GlobeNavigation from "../globe-navigation/globe-navigation";
interface Props {
  backgroundColor: string;
  hideNavigation?: boolean;
}
interface RouteParams {
  category: string | undefined;
}

const DataViewer: FunctionComponent<Props> = ({
  backgroundColor,
  hideNavigation,
}) => {
  const dispatch = useDispatch();
  const { legend } = useSelector(embedElementsSelector);
  const { category } = useParams<RouteParams>();

  const [showContentList, setShowContentList] = useState<boolean>(
    Boolean(category),
  );

  const [currentCategory, setCurrentCategory] = useState<string | null>(
    category || null,
  );

  const history = useHistory();

  const { screenWidth } = useScreenSize();

  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const projectionState = useSelector(projectionSelector);
  const globalGlobeView = useSelector(globeViewSelector);
  const globeSpinning = useSelector(globeSpinningSelector);
  const { mainId, compareId } = selectedLayerIds;
  const mainLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, mainId),
  );
  const mainLayer = useSelector((state: State) =>
    layerListItemSelector(state, mainId),
  );
  const compareLayer = useSelector((state: State) =>
    layerListItemSelector(state, compareId),
  );
  const compareLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, compareId),
  );

  const time = useSelector(timeSelector);
  const [currentView, setCurrentView] = useState(globalGlobeView);
  const [isMainActive, setIsMainActive] = useState(true);
  const flyTo = useSelector(flyToSelector);
  const onChangeHandler = useCallback((view: CameraView) => {
    setCurrentView(view);
    // setting css variable for compass icon
    document.documentElement.style.setProperty(
      "--globe-latitude",
      `${view.lat}deg`,
    );
  }, []);

  const onMoveStartHandler = useCallback(
    () => globeSpinning && dispatch(setGlobeSpinningAction(false)),
    [dispatch, globeSpinning],
  );

  const onMoveEndHandler = useCallback(
    (view: CameraView) => dispatch(setGlobeViewAction(view)),
    [dispatch],
  );

  const onLayerLoadingStateChangeHandler = useCallback(
    (layerId: string, loadingState: LayerLoadingState) =>
      dispatch(updateLayerLoadingStateAction(layerId, loadingState)),
    [dispatch],
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
      (layer) => layer && layer.type !== LayerType.Gallery,
    );

  const getDataWidget = ({
    imageLayer,
    layerDetails,
    active,
    action,
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
          { id, maxValue, minValue, units, basemap, legendValues, hideLegend },
          index,
        ) => {
          if (hideLegend) {
            return null;
          }

          return id === "land_cover.lccs_class" || id === "land_cover.class" ? (
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
        },
      );

  // There is a set of animations which should be played only once
  // This keeps track of that
  const hasAnimationPlayed = useRef(Boolean(category));

  useEffect(() => {
    setShowContentList(Boolean(category));
  }, [category]);

  return (
    // The data-view is a grid with three areas: header - main - footer
    // This is the header area
    <div className={styles.dataViewer}>
      {legend && getLegends()}
      <header className={styles.heading}>
        {showContentList ? (
          <Button link="/" label="" className={styles.backArrow}></Button>
        ) : null}
        <h2>{showContentList ? currentCategory : "Choose a category"}</h2>
      </header>

      {/* This is the main area
        The navigation consists of three main components: the globe, the category navigation and the content navigation
        The globe is the main component and is always visible
        The category navigation is visible when the content navigation is not visible
      */}
      <CategoryNavigation
        showCategories={!showContentList}
        width={screenWidth}
        setCategory={setCurrentCategory}
        isAnimationReady={hasAnimationPlayed}
      />

      {showContentList ? (
        // Todo: should be a link ("button") to the story. Change
        <a
          href="https://storage.googleapis.com/esa-cfs-versions/web/master/index.html#/stories/story-15/0?globe=SI0.09I24.97I23840000I0.00I1738831631198I0II"
          className={cx(
            hasAnimationPlayed.current && styles.showFast,
            styles.exploreButton,
          )}
        >
          Learn More
        </a>
      ) : (
        <Button
          className={cx(
            hasAnimationPlayed.current && styles.showFast,
            styles.exploreButton,
          )}
          onClick={() => {
            history.push(`/${currentCategory}`);
            setShowContentList(!showContentList);
          }}
          label="Explore"
        ></Button>
      )}
      <span
        aria-hidden="true"
        className={styles.swipeIndicator}
        style={{ display: hasAnimationPlayed.current ? "none" : "block" }}
        data-content="swipe to navigate"
      ></span>

      <div
        id="globeWrapper"
        className={cx(
          styles.globeWrapper,
          showContentList && styles.showContentList,
        )}
      >
        {getDataWidget({
          imageLayer: mainImageLayer,
          layerDetails: mainLayerDetails,
          active: isMainActive,
          action: () => setIsMainActive(true),
        })}
      </div>

      <ContentNavigation showContentList={showContentList} />

      {compareLayer &&
        getDataWidget({
          imageLayer: compareImageLayer,
          layerDetails: compareLayerDetails,
          active: !isMainActive,
          action: () => setIsMainActive(false),
        })}
      {!hideNavigation && showGlobeNavigation && (
        <GlobeNavigation mainLayer={mainLayer} compareLayer={compareLayer} />
      )}
    </div>
  );
};

export default DataViewer;
