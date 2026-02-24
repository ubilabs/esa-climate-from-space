import {
  FunctionComponent,
  useCallback,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";

import { CameraView } from "@ubilabs/esa-webgl-globe";
import { useMatomo } from "@streamr/matomo-tracker-react";

import { embedElementsSelector } from "../../../selectors/embed-elements-selector";
import { contentSelector } from "../../../selectors/content";
import { languageSelector } from "../../../selectors/language";
import { layerDetailsSelector } from "../../../selectors/layers/layer-details";
import { layerListItemSelector } from "../../../selectors/layers/list-item";
import { projectionSelector } from "../../../selectors/globe/projection";

import { State } from "../../../reducers";

import { useContentMarker } from "../../../hooks/use-story-markers";
import { useGetLayerListQuery, useGetLayerQuery } from "../../../services/api";
import { useImageLayerData } from "../../../hooks/use-image-layer-data";
import { useAppRouteFlags } from "../../../hooks/use-app-route-flags";

import { GlobeImageLayerData } from "../../../types/globe-image-layer-data";
import { LayerType } from "../../../types/globe-layer-type";
import { LegendValueColor } from "../../../types/legend-value-color";
import { Layer } from "../../../types/layer";
import { GlobeItem } from "../../../types/gallery-item";
import { LayerLoadingStateChangeHandle } from "../data-viewer/data-viewer";

import Gallery from "../gallery/gallery";
import Globe from "../globe/globe";
import HoverLegend from "../../layers/hover-legend/hover-legend";
import LayerLegend from "../../layers/layer-legend/layer-legend";
import DataSetInfo from "../../layers/data-set-info/data-set-info";
import TimeSlider from "../../layers/time-slider/time-slider";

interface Props {
  globeItem?: GlobeItem;
  className?: string;
  showMarkers?: boolean;
  autoplay?: boolean;
  touchable?: boolean;
  globeView: CameraView;
  mainId: string | null;
  compareId: string | null;
  time: number;
  setGlobeTime: (time: number) => void;
  globeSpinning: boolean;
  flyTo: CameraView | null;
  onMoveStartHandler: () => void;
  onMoveEndHandler: (view: CameraView) => void;
  onLayerLoadingStateChangeHandler: LayerLoadingStateChangeHandle;
}

export const GetDataWidget: FunctionComponent<Props> = ({
  className,
  showMarkers = true,
  autoplay = false,
  touchable = true,
  globeView,
  mainId,
  compareId,
  time,
  setGlobeTime,
  globeSpinning,
  flyTo,
  onMoveStartHandler,
  onMoveEndHandler,
  onLayerLoadingStateChangeHandler,
}) => {
  const projectionState = useSelector(projectionSelector);

  const [currentView, setCurrentView] = useState(globeView);

  const [isMainActive, setIsMainActive] = useState(true);
  const { trackEvent } = useMatomo();

  const { isContentNavRoute, isStoriesRoute, isDataRoute } = useAppRouteFlags();

  const language = useSelector(languageSelector);

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

  const { data: layers } = useGetLayerListQuery(language);

  const onDatasetChange = useEffectEvent(() => {
    // Only track when on data route to ensure tracking is only done on actively selecting datasets
    if (isDataRoute && layers) {
      const mainLayerName = layers?.find((layer) => layer.id === mainId)?.name;
      const compareLayerName = layers?.find(
        (layer) => layer.id === compareId,
      )?.name;

      // Don't track if the main layer is not selected or its name is not yet available
      if (!mainId || !mainLayerName) {
        return;
      }

      trackEvent({
        category: "datasets",
        action: !compareId ? "select" : "compare",
        name: !compareId
          ? mainLayerName
          : `${mainLayerName} - ${compareLayerName}`,
      });
    }
  });

  useEffect(() => {
    onDatasetChange();
  }, [mainId, compareId, isDataRoute]);

  const selectedContentId = useSelector(contentSelector).contentId;

  const contentMarker = useContentMarker(selectedContentId ?? null, language);

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

  // apply changes in the app state view to our local view copy
  // we don't use the app state view all the time to keep store updates low
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentView(globeView);
  }, [globeView]);

  const onChangeHandler = useCallback((view: CameraView) => {
    setCurrentView(view);
    // setting css variable for compass icon
    document
      .getElementById("ui-compass")
      ?.style.setProperty("--globe-latitude", `${view.lat}deg`);
  }, []);

  const { legend, time_slider } = useSelector(embedElementsSelector);

  // Shared props for Globe instances
  const globeProps = {
    ...(showMarkers && contentMarker && { markers: [contentMarker] }),
    backgroundColor: "",
    isMarkerOffset: isContentNavRoute,
    touchable,
    view: currentView,
    projectionState,
    spinning: globeSpinning,
    flyTo,
    onChange: onChangeHandler,
    onMoveStart: onMoveStartHandler,
    onMoveEnd: onMoveEndHandler,
    onLayerLoadingStateChange: onLayerLoadingStateChangeHandler,
    className,
  };

  const isGalleryTypeLayer = (layer: GlobeImageLayerData | null | undefined) =>
    layer?.type === LayerType.Gallery;

  return (
    <>
      {isContentNavRoute ? null : (
        <>
          {!isStoriesRoute && <DataSetInfo />}
          {legend && getLegends()}
          {time_slider && (
            <TimeSlider
              time={time}
              setGlobeTime={setGlobeTime}
              mainId={mainId}
              compareId={compareId}
              noTimeClamp={isStoriesRoute}
              autoplay={autoplay}
            />
          )}
        </>
      )}

      {isGalleryTypeLayer(mainImageLayer) ? (
        <Gallery imageLayer={mainImageLayer} />
      ) : mainImageLayer && (
        <Globe
          {...globeProps}
          active={isMainActive}
          imageLayer={mainImageLayer}
          layerDetails={mainLayerDetails || null}
          onMouseEnter={() => setIsMainActive(true)}
          onTouchStart={() => setIsMainActive(true)}
        />
      )}
      {compareLayer && isGalleryTypeLayer(compareImageLayer) ? (
        <Gallery imageLayer={compareImageLayer} />
      ) : compareLayer && compareImageLayer && (
        <Globe
          {...globeProps}
          active={!isMainActive}
          imageLayer={compareImageLayer}
          layerDetails={compareLayerDetails || null}
          onMouseEnter={() => setIsMainActive(false)}
          onTouchStart={() => setIsMainActive(false)}
        />
      )}
    </>
  );
};
