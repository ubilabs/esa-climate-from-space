import {
  FunctionComponent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { CameraView } from "@ubilabs/esa-webgl-globe";
import { useDispatch, useSelector } from "react-redux";

import { embedElementsSelector } from "../../../selectors/embed-elements-selector";
import { contentSelector } from "../../../selectors/content";
import { flyToSelector } from "../../../selectors/fly-to";
import { globeSpinningSelector } from "../../../selectors/globe/spinning";
import { globeViewSelector } from "../../../selectors/globe/view";
import { languageSelector } from "../../../selectors/language";
import { layerDetailsSelector } from "../../../selectors/layers/layer-details";
import { layerListItemSelector } from "../../../selectors/layers/list-item";
import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";
import { projectionSelector } from "../../../selectors/globe/projection";
import { timeSelector } from "../../../selectors/globe/time";

import { updateLayerLoadingState } from "../../../reducers/globe/layer-loading-state";
import { setGlobeSpinning } from "../../../reducers/globe/spinning";
import { setGlobeView } from "../../../reducers/globe/view";
import { State } from "../../../reducers";

import { useContentMarker } from "../../../hooks/use-story-markers";
import { useGetLayerQuery } from "../../../services/api";
import { useImageLayerData } from "../../../hooks/use-image-layer-data";
import { useAppRouteFlags } from "../../../hooks/use-app-route-flags";

import { GlobeImageLayerData } from "../../../types/globe-image-layer-data";
import { LayerType } from "../../../types/globe-layer-type";
import { LegendValueColor } from "../../../types/legend-value-color";
import { Layer } from "../../../types/layer";

import { LayerLoadingStateChangeHandle } from "../data-viewer/data-viewer";
import Gallery from "../gallery/gallery";
import Globe from "../globe/globe";
import HoverLegend from "../../layers/hover-legend/hover-legend";
import LayerLegend from "../../layers/layer-legend/layer-legend";
import DataSetInfo from "../../layers/data-set-info/data-set-info";
import TimeSlider from "../../layers/time-slider/time-slider";

interface Props {
  className?: string;
  showMarkers?: boolean;
}

export const GetDataWidget: FunctionComponent<Props> = ({
  className,
  showMarkers = true,
}) => {
  const projectionState = useSelector(projectionSelector);
  const globalGlobeView = useSelector(globeViewSelector);
  const globeSpinning = useSelector(globeSpinningSelector);
  const [currentView, setCurrentView] = useState(globalGlobeView);
  const flyTo = useSelector(flyToSelector);
  const [isMainActive, setIsMainActive] = useState(true);

  const language = useSelector(languageSelector);
  const dispatch = useDispatch();
  const time = useSelector(timeSelector);

  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const { mainId, compareId } = selectedLayerIds;

  const { isContentNavRoute, isStoriesRoute } = useAppRouteFlags();

  const mainLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, mainId),
  );

  const compareLayer = useSelector((state: State) =>
    layerListItemSelector(state, compareId),
  );

  const compareLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, compareId),
  );

  // If initially, there is a main layer selected, we need to fetch the layer details
  useGetLayerQuery(mainId ?? "", { skip: !mainId });
  useGetLayerQuery(compareId ?? "", { skip: !compareId });

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

  const selectedContentId = useSelector(contentSelector).contentId;

  const contentMarker = useContentMarker(selectedContentId ?? null, language);

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
        {...(showMarkers &&
          contentMarker && {
            markers: [contentMarker],
          })}
        backgroundColor={""}
        // We should offset the markers when user is in content nav
        isMarkerOffset={isContentNavRoute}
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
        className={className}
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

  const mainImageLayer = useImageLayerData(mainLayerDetails, time);
  const compareImageLayer = useImageLayerData(compareLayerDetails, time);

  useLayoutEffect(() => {
    if (
      currentView.lat !== globalGlobeView.lat ||
      currentView.lng !== globalGlobeView.lng ||
      currentView.altitude !== globalGlobeView.altitude
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentView(globalGlobeView);
    }
  }, [globalGlobeView, currentView]);

  const onChangeHandler = useCallback((view: CameraView) => {
    setCurrentView(view);
    // setting css variable for compass icon
    document
      .getElementById("ui-compass")
      ?.style.setProperty("--globe-latitude", `${view.lat}deg`);
  }, []);

  const { legend, time_slider } = useSelector(embedElementsSelector);

  // stop globe spinning when layer is selected
  useEffect(() => {
    if ((mainId || compareId) && globeSpinning) {
      dispatch(setGlobeSpinning(false));
    }
  }, [dispatch, mainId, compareId, globeSpinning]);

  return (
    <>
      {isContentNavRoute ? null : (
        <>
          {!isStoriesRoute && <DataSetInfo />}
          {legend && getLegends()}
          {time_slider && <TimeSlider />}
        </>
      )}

      {getDataWidget({
        imageLayer: mainImageLayer,
        layerDetails: mainLayerDetails,
        active: isMainActive,
        action: () => setIsMainActive(true),
      })}
      {compareLayer &&
        getDataWidget({
          imageLayer: compareImageLayer,
          layerDetails: compareLayerDetails,
          active: !isMainActive,
          action: () => setIsMainActive(false),
        })}
    </>
  );
};
