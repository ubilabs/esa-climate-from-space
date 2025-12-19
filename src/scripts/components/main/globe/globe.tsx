import {
  FunctionComponent,
  memo,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";

import cx from "classnames";

import {
  CameraView,
  LayerLoadingState,
  LayerProps,
  MarkerProps,
  RenderMode,
  WebGlGlobe,
  WebGlGlobeEventMap,
} from "@ubilabs/esa-webgl-globe";

import GLOBE_WORKER_URL from "@ubilabs/esa-webgl-globe/worker?url";
import ATMOSPHERE_TEXTURE_URL from "@ubilabs/esa-webgl-globe/textures/atmosphere.png?url";
import SHADING_TEXTURE_URL from "@ubilabs/esa-webgl-globe/textures/shading.png?url";

import { Layer } from "../../../types/layer";
import { Marker } from "../../../types/marker-type";
import { GlobeImageLayerData } from "../../../types/globe-image-layer-data";
import { useGlobeRouteState } from "../../../hooks/use-globe-route-state";
import { useAppRouteFlags } from "../../../hooks/use-app-route-flags";

import { isElectron } from "../../../libs/electron";
import { BasemapId } from "../../../types/basemap";
import { LayerType } from "../../../types/globe-layer-type";
import { useScreenSize } from "../../../hooks/use-screen-size";

import { GlobeProjection } from "../../../types/globe-projection";
import { LayerLoadingStateChangeHandle } from "../data-viewer/data-viewer";

import { MarkerMarkup } from "./marker-markup";
import { GlobeProjectionState } from "../../../types/globe-projection-state";

import config, { CONTENT_NAV_LONGITUDE_OFFSET } from "../../../config/main";

import styles from "./globe.module.css";

type LayerLoadingStateChangedEvent =
  WebGlGlobeEventMap["layerLoadingStateChanged"];

WebGlGlobe.setTileSelectorWorkerUrl(GLOBE_WORKER_URL);
WebGlGlobe.setTextureUrls({
  atmosphere: ATMOSPHERE_TEXTURE_URL,
  shading: SHADING_TEXTURE_URL,
});

interface Props {
  active: boolean;
  view: CameraView;
  projectionState: GlobeProjectionState;
  imageLayer: GlobeImageLayerData | null;
  layerDetails: Layer | null;
  spinning: boolean;
  flyTo: CameraView | null;
  markers?: Marker[];
  isMarkerOffset?: boolean;
  backgroundColor: string;
  onMouseEnter: () => void;
  onTouchStart: () => void;
  onChange: (view: CameraView) => void;
  onMoveStart: () => void;
  onMoveEnd: (view: CameraView) => void;
  className?: string;
  onLayerLoadingStateChange: (
    layerId: string,
    state: LayerLoadingState,
  ) => void;
}

export type GlobeProps = Partial<Props>;

const EMPTY_FUNCTION = () => {};

const Globe: FunctionComponent<Props> = memo((props) => {
  const {
    view,
    projectionState,
    layerDetails,
    imageLayer,
    markers,
    backgroundColor,
    className,
    onMouseEnter,
    onTouchStart,
  } = props;

  const [containerRef, globe] = useWebGlGlobe(view);
  const initialTilesLoaded = useInitialBasemapTilesLoaded(globe);

  useGlobeRouteState(globe);

  useGlobeLayers(globe, layerDetails, imageLayer);
  useGlobeMarkers(globe, markers);

  useProjectionSwitch(globe, projectionState.projection);
  useMultiGlobeSynchronization(globe, props);

  useLayerLoadingStateUpdater(globe, props.onLayerLoadingStateChange);

  return (
    <div
      ref={containerRef}
      className={cx(
        styles.globe,
        initialTilesLoaded && styles.fadeIn,
        className,
      )}
      style={{ backgroundColor }}
      onMouseEnter={() => onMouseEnter()}
      onTouchStart={() => onTouchStart()}
    ></div>
  );
});

/**
 * Use a state-variable and callback as a ref so the element can be used
 * as dependency in other effects.
 */
function useCallbackRef() {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const ref = useCallback((node: HTMLElement | null) => setElement(node), []);

  return [ref, element] as const;
}

/**
 * Creates the WebGlGlobe instance once the container element becomes available.
 */
function useWebGlGlobe(view: CameraView) {
  const [containerRef, containerEl] = useCallbackRef();
  const [globe, setGlobe] = useState<WebGlGlobe | null>(null);

  const initGlobe = useEffectEvent((element: HTMLElement | null) => {
    if (!element) {
      return EMPTY_FUNCTION;
    }

    const newGlobe = new WebGlGlobe(element, {
      cameraView: view,
      renderOptions: {
        atmosphereEnabled: true,
        shadingEnabled: true,
        atmosphereStrength: 0.8,
        atmosphereColor: [0.58, 0.79, 1], // {r: 148, g: 201, b: 255}
      },
    });

    if ("renderer" in newGlobe) {
      // @TODO: Remove this setting after globe controls have been refactored.
      // @ts-expect-error Property 'renderer' is private and only accessible within class 'WebGlGlobe'.
      newGlobe.renderer.globeControls.zoomSpeed = 1.5;
    }

    if ("renderer" in newGlobe) {
      // @TODO: Remove this setting after globe controls have been refactored.
      // @ts-expect-error Property 'renderer' is private and only accessible within class 'WebGlGlobe'.
      newGlobe.renderer.globeControls.zoomSpeed = 1.5;
    }

    setGlobe(newGlobe);

    return () => newGlobe.destroy();
  });

  useEffect(() => {
    initGlobe(containerEl);
  }, [containerEl]);

  return [containerRef, globe] as const;
}

/**
 * Updates the globe layers as soon as available.
 */
function useGlobeLayers(
  globe: WebGlGlobe | null,
  layerDetails: Layer | null,
  imageLayer: GlobeImageLayerData | null,
) {
  const { isBaseRoute } = useAppRouteFlags();
  useEffect(() => {
    if (!globe) {
      return EMPTY_FUNCTION;
    }
    const layers = getLayerProps(imageLayer, layerDetails, isBaseRoute);

    globe.setProps({ layers });

    // we don't reset the layers in the cleanup-function as this would lead
    // to animations not working.
    return EMPTY_FUNCTION;
  }, [globe, layerDetails, imageLayer, isBaseRoute]);
}

/**
 * Updates the markers on the globe when they become available.
 */
function useGlobeMarkers(globe: WebGlGlobe | null, markers?: Marker[]) {
  const { isDesktop } = useScreenSize();
  const navigate = useNavigate();

  useEffect(() => {
    if (!globe || !markers) {
      return EMPTY_FUNCTION;
    }

    globe.setProps({
      markers: getMarkerProps(
        markers,
        (marker: Marker) => {
          if (!marker.link) {
            return;
          }
          navigate(marker.link);
        },
        isDesktop,
      ),
    });

    return () => {
      globe.setProps({ markers: [] });
    };
  }, [navigate, globe, markers, isDesktop]);
}

/**
 * Manages a single state-variable indicating wether the first tiles of the
 * basemaps have been loaded.
 */
function useInitialBasemapTilesLoaded(globe: WebGlGlobe | null) {
  const [initialTilesLoaded, setInitialTilesLoaded] = useState(false);

  const handleLoadingStateChange = useCallback(
    (ev: LayerLoadingStateChangedEvent) => {
      const { layer, state } = ev.detail;

      if (layer.id === "basemap") {
        if (state === "ready" || state === "idle") {
          setInitialTilesLoaded(true);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!globe) {
      return EMPTY_FUNCTION;
    }

    globe.addEventListener(
      "layerLoadingStateChanged",
      handleLoadingStateChange,
    );

    return () => {
      globe.removeEventListener(
        "layerLoadingStateChanged",
        handleLoadingStateChange,
      );
    };
  }, [globe, handleLoadingStateChange]);

  return initialTilesLoaded;
}

/**
 * Switch the projection mode used by the globe.
 */
function useProjectionSwitch(
  globe: WebGlGlobe | null,
  projection: GlobeProjection,
) {
  useEffect(() => {
    if (!globe) {
      return;
    }

    const renderMode = (
      projection === GlobeProjection.Sphere ? "globe" : "map"
    ) as RenderMode;

    globe.setProps({ renderMode });
  }, [globe, projection]);
}

/**
 * Integrate the globe with the external view-state events and props
 * (view / flyTo / onChange).
 */
function useMultiGlobeSynchronization(globe: WebGlGlobe | null, props: Props) {
  const { view, active, flyTo, isMarkerOffset } = props;

  // forward camera changes from the active view to the parent component
  useCameraChangeEvents(globe, props);

  // set camera-view unless it's the active globe
  useEffect(() => {
    if (globe && !active) {
      // make sure the applied is not animated
      globe.setProps({ cameraView: { ...view } });
    }
  }, [globe, view, active]);

  // apply incomfing flyTo props to the globe
  useEffect(() => {
    if (!globe || !flyTo) return;
    globe.setProps({
      cameraView: {
        ...flyTo,
        lng: flyTo.lng + (isMarkerOffset ? CONTENT_NAV_LONGITUDE_OFFSET : 0),
      },
    });
  }, [flyTo, globe, isMarkerOffset]);
}

/**
 * Call the onChange callback from the props from an active globe.
 */
function useCameraChangeEvents(globe: WebGlGlobe | null, props: Props) {
  const { active, onMoveStart, onChange, onMoveEnd } = props;

  const ref = useRef({
    timerId: 0,
    isMoving: false,
    lastCameraView: null as CameraView | null,
  });

  const handleViewChanged = useCallback(
    (ev: CustomEvent<CameraView>) => {
      ref.current.lastCameraView = ev.detail;

      if (!ref.current.isMoving) {
        ref.current.isMoving = true;
        onMoveStart();
      }

      window.clearTimeout(ref.current.timerId);
      ref.current.timerId = window.setTimeout(() => {
        ref.current.isMoving = false;
        onMoveEnd(ref.current.lastCameraView as CameraView);
      }, 400);

      onChange(ev.detail);
    },
    [onMoveStart, onChange, onMoveEnd],
  );

  useEffect(() => {
    if (!globe || !active) {
      return EMPTY_FUNCTION;
    }

    globe.addEventListener("cameraViewChanged", handleViewChanged);

    return () => {
      // there could be a leftover timer running
      // eslint-disable-next-line react-hooks/exhaustive-deps
      window.clearTimeout(ref.current.timerId);
      globe.removeEventListener("cameraViewChanged", handleViewChanged);
    };
  }, [globe, active, handleViewChanged]);
}

/**
 * Dispatch layerLoadingStates from the globe to the parent component.
 */
function useLayerLoadingStateUpdater(
  globe: WebGlGlobe | null,
  callback: LayerLoadingStateChangeHandle,
) {
  const handler = useCallback(
    (ev: LayerLoadingStateChangedEvent) => {
      callback(ev.detail.layer.id, ev.detail.state);
    },
    [callback],
  );

  useEffect(() => {
    if (!globe) {
      return EMPTY_FUNCTION;
    }

    globe.addEventListener("layerLoadingStateChanged", handler);

    return () => globe.removeEventListener("layerLoadingStateChanged", handler);
  }, [globe, handler]);
}

// ----
// utility functions
// ----
function getLayerProps(
  imageLayer: GlobeImageLayerData | null,
  layerDetails: Layer | null,
  includeClouds: boolean = true,
) {
  const basemapUrl = getBasemapUrl(layerDetails);
  const cloudsUrl = getBasemapUrl({ basemap: "clouds" } as Layer);

  const basemapMaxZoom = getBasemapMaxZoom(layerDetails);

  const layers = [
    {
      id: "basemap",
      zIndex: 0,
      minZoom: 1,
      maxZoom: basemapMaxZoom,
      urlParameters: {},
      getUrl: ({ x, y, zoom }) => `${basemapUrl}/${zoom}/${x}/${y}.png`,
    } as LayerProps,
  ];

  if (includeClouds) {
    layers.push({
      id: "clouds",
      zIndex: 1,
      minZoom: 0,
      maxZoom: basemapMaxZoom,
      type: LayerType.Image,
      urlParameters: {},
      getUrl: () => `${cloudsUrl}/image.png`,
    });
  }

  if (imageLayer && layerDetails) {
    const { id, url } = imageLayer;
    const { type = LayerType.Image } = layerDetails;
    layers.push({
      id,
      zIndex: 1,
      minZoom: 1,
      maxZoom: layerDetails.zoomLevels - 1,
      type: type === LayerType.Image ? "image" : "tile",
      urlParameters: {},
      getUrl:
        type === LayerType.Image
          ? () => url
          : ({ x, y, zoom }) =>
              url
                .replace("{x}", String(x))
                .replace("{reverseY}", String(y))
                .replace("{z}", String(zoom)),
    });
  }

  return layers;
}

function getMarkerProps(
  markers: Marker[],
  onClick: (marker: Marker) => void,
  isDesktop: boolean = true,
): MarkerProps[] {
  const res: MarkerProps[] = [];

  for (const marker of markers) {
    const [lng, lat] = marker.position;
    const html = renderToStaticMarkup(
      <MarkerMarkup title={marker.title} isDesktop={isDesktop} />,
    );

    if (!marker.link) {
      console.error("marker witout link!", marker);
      continue;
    }

    res.push({
      lat,
      lng,
      html,
      id: marker.link,
      onClick: () => onClick(marker),
    });
  }

  return res;
}

function getBasemapUrl(layerDetails: Layer | null) {
  const urls = isElectron() ? config.basemapUrlsOffline : config.basemapUrls;

  return urls[getBasemapId(layerDetails)];
}

function getBasemapMaxZoom(layerDetails: Layer | null) {
  return config.basemapMaxZoom[getBasemapId(layerDetails)];
}

function getBasemapId(layerDetails: Layer | null): BasemapId {
  if (!layerDetails) {
    return config.defaultBasemap;
  } else if (
    !layerDetails.basemap ||
    !config.basemapUrls[layerDetails.basemap]
  ) {
    return config.defaultLayerBasemap;
  }

  return layerDetails.basemap;
}

export default Globe;
