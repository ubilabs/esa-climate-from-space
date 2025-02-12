import { CameraView, LayerLoadingState } from "@ubilabs/esa-webgl-globe";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useImageLayerData } from "../../../hooks/use-image-layer-data";
import HoverLegend from "../../layers/hover-legend/hover-legend";
import LayerLegend from "../../layers/layer-legend/layer-legend";
import Gallery from "../gallery/gallery";
import Globe from "../globe/globe";

import { embedElementsSelector } from "../../../selectors/embed-elements-selector";
import { GlobeImageLayerData } from "../../../types/globe-image-layer-data";
import { LayerType } from "../../../types/globe-layer-type";
import { Layer } from "../../../types/layer";
import { LegendValueColor } from "../../../types/legend-value-color";
import { Marker } from "../../../types/marker-type";

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
import { useGetLayerQuery } from "../../../services/api";
import GlobeNavigation from "../globe-navigation/globe-navigation";

import styles from "./data-viewer.module.css";

interface Props {
  backgroundColor: string;
  hideNavigation?: boolean;
  markers?: Marker[];
}

export type LayerLoadingStateChangeHandle = (
  layerId: string,
  loadingState: LayerLoadingState,
) => void;

const DataViewer: FunctionComponent<Props> = ({
  backgroundColor,
  hideNavigation,
  markers = [],
}) => {
  const dispatch = useDispatch();
  const { legend } = useSelector(embedElementsSelector);

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

  // stop globe spinning when layer is selected
  useEffect(() => {
    if ((mainId || compareId) && globeSpinning) {
      dispatch(setGlobeSpinning(false));
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
