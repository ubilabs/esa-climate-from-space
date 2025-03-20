import {
  FunctionComponent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { LayerType } from "../../../types/globe-layer-type";
import { Layer } from "../../../types/layer";
import Gallery from "../gallery/gallery";
import Globe, { GlobeProps } from "../globe/globe";
import { projectionSelector } from "../../../selectors/globe/projection";
import { useDispatch, useSelector } from "react-redux";
import { globeViewSelector } from "../../../selectors/globe/view";
import { CameraView } from "@ubilabs/esa-webgl-globe";
import { globeSpinningSelector } from "../../../selectors/globe/spinning";
import { flyToSelector } from "../../../selectors/fly-to";
import { setGlobeSpinning } from "../../../reducers/globe/spinning";
import { setGlobeView } from "../../../reducers/globe/view";
import { LayerLoadingStateChangeHandle } from "../data-viewer/data-viewer";
import { updateLayerLoadingState } from "../../../reducers/globe/layer-loading-state";
import { timeSelector } from "../../../selectors/globe/time";
import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";
import { layerDetailsSelector } from "../../../selectors/layers/layer-details";
import { State } from "../../../reducers";
import { layerListItemSelector } from "../../../selectors/layers/list-item";
import { useGetLayerQuery } from "../../../services/api";
import HoverLegend from "../../layers/hover-legend/hover-legend";
import { LegendValueColor } from "../../../types/legend-value-color";
import LayerLegend from "../../layers/layer-legend/layer-legend";
import { useImageLayerData } from "../../../hooks/use-image-layer-data";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";
import GlobeNavigation from "../globe-navigation/globe-navigation";
import { Marker } from "../../../types/marker-type";
import { GlobeImageLayerData } from "../../../types/globe-image-layer-data";

interface Props {
  hideNavigation: boolean;
  markers?: Marker[];
  globeProps: GlobeProps;
  showClouds?: boolean;
  className?: string;
}

export const GetDataWidget: FunctionComponent<Props> = ({
  hideNavigation,
  markers,
  globeProps,
  showClouds,
  className
}) => {
  const projectionState = useSelector(projectionSelector);
  const globalGlobeView = useSelector(globeViewSelector);
  const globeSpinning = useSelector(globeSpinningSelector);
  const [currentView, setCurrentView] = useState(globalGlobeView);
  const flyTo = useSelector(flyToSelector);
  const [isMainActive, setIsMainActive] = useState(true);

  const dispatch = useDispatch();
  const time = useSelector(timeSelector);

  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const { mainId, compareId } = selectedLayerIds;

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
        markers={markers}
        backgroundColor={""}
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

  //const imageLayer = compareLayer ? compareImageLayer : mainImageLayer;
  const layerDetails = compareLayer ? compareLayerDetails : mainLayerDetails;

  const updatedLayerDetails = showClouds
    ? {
        ...(layerDetails || {}),
        basemap: "clouds",
      }
    : layerDetails;

  // apply changes in the app state view to our local view copy
  // we don't use the app state view all the time to keep store updates low
  useLayoutEffect(() => {
    setCurrentView(globalGlobeView);
  }, [globalGlobeView]);

  const onChangeHandler = useCallback((view: CameraView) => {
    setCurrentView(view);
    // setting css variable for compass icon
    document.documentElement.style.setProperty(
      "--globe-latitude",
      `${view.lat}deg`,
    );
  }, []);

  const { legend } = useSelector(embedElementsSelector);

  // stop globe spinning when layer is selected
  useEffect(() => {
    if ((mainId || compareId) && globeSpinning) {
      dispatch(setGlobeSpinning(false));
    }
  }, [dispatch, mainId, compareId, globeSpinning]);

  if (mainImageLayer?.type === LayerType.Gallery) {
    return <Gallery imageLayer={mainImageLayer} />;
  }

  return (
    <>
      {legend && getLegends()}

      {getDataWidget({
        imageLayer: mainImageLayer,
        layerDetails: updatedLayerDetails,
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
