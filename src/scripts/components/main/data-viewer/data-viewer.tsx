import { CameraView, LayerLoadingState } from "@ubilabs/esa-webgl-globe";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { embedElementsSelector } from "../../../selectors/embed-elements-selector";
import { GlobeImageLayerData } from "../../../types/globe-image-layer-data";
import { LayerType } from "../../../types/globe-layer-type";
import { Layer } from "../../../types/layer";
import { LegendValueColor } from "../../../types/legend-value-color";

import { State } from "../../../reducers";
import { updateLayerLoadingState } from "../../../reducers/globe/layer-loading-state";
import { setGlobeSpinning } from "../../../reducers/globe/spinning";
import { setGlobeView } from "../../../reducers/globe/view";
import { flyToSelector } from "../../../selectors/fly-to";
import { projectionSelector } from "../../../selectors/globe/projection";
import { globeSpinningSelector } from "../../../selectors/globe/spinning";
import { timeSelector } from "../../../selectors/globe/time";
import { globeViewSelector } from "../../../selectors/globe/view";
import { layerDetailsSelector } from "../../../selectors/layers/layer-details";
import { layerListItemSelector } from "../../../selectors/layers/list-item";
import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";
import { useGetLayerQuery, useGetStoriesQuery } from "../../../services/api";
import { languageSelector } from "../../../selectors/language";

import { useScreenSize } from "../../../hooks/use-screen-size";
import ContentNavigation from "../content-navigation/content-navigation";
import GlobeNavigation from "../globe-navigation/globe-navigation";
// import { useHistory } from "react-router";

import Button from "../button/button";
import CategoryNavigation from "../category-navigation/category-navigation";
import styles from "./data-viewer.module.css";

import cx from "classnames";
import { useImageLayerData } from "../../../hooks/use-image-layer-data";
import HoverLegend from "../../layers/hover-legend/hover-legend";
import LayerLegend from "../../layers/layer-legend/layer-legend";
import Gallery from "../gallery/gallery";
import Globe from "../globe/globe";
import { useHistory, useParams } from "react-router-dom";
import { setSelectedTags } from "../../../reducers/story";
interface Props {
  backgroundColor: string;
  hideNavigation?: boolean;
}
interface RouteParams {
  category: string | undefined;
}

export type LayerLoadingStateChangeHandle = (
  layerId: string,
  loadingState: LayerLoadingState,
) => void;

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
  // If initially, there is a main layer selected, we need to fetch the layer details
  useGetLayerQuery(mainId ?? "", { skip: !mainId });

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

  const language = useSelector(languageSelector);
  const { data: stories } = useGetStoriesQuery(language);

  const onMoveStartHandler = useCallback(
    () => globeSpinning && dispatch(setGlobeSpinning(false)),
    [dispatch, globeSpinning],
  );

  const onMoveEndHandler = useCallback(
    (view: CameraView) => dispatch(setGlobeView(view)),
    [dispatch],
  );

  const onLayerLoadingStateChangeHandler: LayerLoadingStateChangeHandle =
    useCallback(
      (layerId, loadingState) =>
        dispatch(updateLayerLoadingState({ layerId, loadingState })),
      [dispatch],
    );

  const mainImageLayer = useImageLayerData(mainLayerDetails, time);
  const compareImageLayer = useImageLayerData(compareLayerDetails, time);

  // apply changes in the app state view to our local view copy
  // we don't use the app state view all the time to keep store updates low
  useLayoutEffect(() => {
    setCurrentView(globalGlobeView);
  }, [globalGlobeView]);

  // There is a set of animations which should be played only once
  // This keeps track of that
  const hasAnimationPlayed = useRef(Boolean(category));

  useEffect(() => {
    setShowContentList(Boolean(category));
  }, [category]);

  // stop globe spinning when layer is selected
  useEffect(() => {
    if ((mainId || compareId) && globeSpinning) {
      dispatch(setGlobeSpinning(false));
    }
  }, [dispatch, mainId, compareId, globeSpinning]);

  if (!stories) {
    return null;
  }

  const allTags: string[] = stories
    .map(({ tags }) => tags)
    .filter(Boolean)
    .flat();
  const uniqTags = Array.from(new Set(allTags));

  const contents = stories.filter(
    (story) => category && story.tags?.includes(category),
  );
  console.log("🚀 ~ contents:", contents);
  // create a list of all tags with their number of occurrences in the stories
  // For now, we filter out tags with less than 3 occurrences as long as we don't have the new categories

  const arcs = uniqTags
    .map((tag) => {
      const count = allTags.filter((t) => t === tag).length;
      return { [tag]: count };
    })
    // Todo: Delete this filter when we have the new categories
    .filter((arc) => Object.values(arc)[0] > 2);

  // Show content of selected tag

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
        onSelect={(category) => setSelectedTags([category])}
        arcs={arcs}
        showCategories={!showContentList}
        width={screenWidth}
        setCategory={setCurrentCategory}
        isAnimationReady={hasAnimationPlayed}
      />

      {!showContentList ? (
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
      ) : null}
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

      <ContentNavigation
        showContentList={showContentList}
        contents={contents}
      />

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
