import {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { CameraView, LayerLoadingState } from "@ubilabs/esa-webgl-globe";
import Globe from "../globe/globe";
import Gallery from "../gallery/gallery";
import GlobeNavigation from "../globe-navigation/globe-navigation";
import LayerLegend from "../../layers/layer-legend/layer-legend";
import { useImageLayerData } from "../../../hooks/use-image-layer-data";
import HoverLegend from "../../layers/hover-legend/hover-legend";

import { Marker } from "../../../types/marker-type";
import { LayerType } from "../../../types/globe-layer-type";
import { GlobeImageLayerData } from "../../../types/globe-image-layer-data";
import { Layer } from "../../../types/layer";
import { LegendValueColor } from "../../../types/legend-value-color";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import styles from "./data-viewer.module.css";
import updateLayerLoadingState from "../../../actions/update-layer-loading-state";
import { State } from "../../../reducers";
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

interface Props {
  backgroundColor: string;
  hideNavigation?: boolean;
  markers?: Marker[];
}

const DataViewer: FunctionComponent<Props> = ({
  backgroundColor,
  hideNavigation,
  markers = [],
}) => {
  const dispatch = useDispatch();
  const { legend } = useSelector(embedElementsSelector);

  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  console.log("🚀 ~ selectedLayerIds:", selectedLayerIds);
  const projectionState = useSelector(projectionSelector);
  console.log("🚀 ~ projectionState:", projectionState);
  const globalGlobeView = useSelector(globeViewSelector);
  console.log("🚀 ~ globalGlobeView:", globalGlobeView);
  const globeSpinning = useSelector(globeSpinningSelector);
  console.log("🚀 ~ globeSpinning:", globeSpinning);
  const { mainId, compareId } = selectedLayerIds;
  console.log("🚀 ~ mainId:", mainId);
  const mainLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, mainId),
  );
  console.log("🚀 ~ mainLayerDetails:", mainLayerDetails);
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
  console.log("🚀 ~ time:", time);
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
    () => globeSpinning && dispatch(setGlobeSpinning(false)),
    [dispatch, globeSpinning],
  );

  const onMoveEndHandler = useCallback(
    (view: CameraView) => dispatch(setGlobeView(view)),
    [dispatch],
  );

  const onLayerLoadingStateChangeHandler = useCallback(
    (layerId: string, loadingState: LayerLoadingState) =>
      dispatch(updateLayerLoadingState({ layerId, loadingState })),
    [dispatch],
  );

  const mainImageLayer = useImageLayerData(mainLayerDetails, time);
  console.log("🚀 ~ time:", time);
  const compareImageLayer = useImageLayerData(compareLayerDetails, time);
  console.log("🚀 ~ time:", time);

  // apply changes in the app state view to our local view copy
  // we don't use the app state view all the time to keep store updates low
  useLayoutEffect(() => {
    setCurrentView(globalGlobeView);
  }, [globalGlobeView]);

  // stop globe spinning when layer is selected
  useEffect(() => {
    if ((mainId || compareId) && globeSpinning) {
      console.log("🚀 ~ useEffect ~ mainId:", mainId);
      dispatch(setGlobeSpinning(false));
    }
  }, [dispatch, mainId, compareId, globeSpinning]);
  console.log("🚀 ~ mainId:", mainId);

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
    <div className={styles.dataViewer}>
      {legend && getLegends()}

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
      {!hideNavigation && showGlobeNavigation && (
        <GlobeNavigation mainLayer={mainLayer} compareLayer={compareLayer} />
      )}
    </div>
  );
};

export default DataViewer;
