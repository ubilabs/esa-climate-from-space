import {
  FunctionComponent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import cx from "classnames";

// Easing function for smoother animation
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

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

import { isElectron } from "../../../libs/electron";
import { BasemapId } from "../../../types/basemap";
import { LayerType } from "../../../types/globe-layer-type";
import { useHistory } from "react-router-dom";
import config from "../../../config/main";

import { GlobeProjection } from "../../../types/globe-projection";
import { LayerLoadingStateChangeHandle } from "../data-viewer/data-viewer";
import { FlyToPayload, setFlyTo } from "../../../reducers/fly-to";
import { renderToStaticMarkup } from "react-dom/server";
import { MarkerMarkup } from "./marker-markup";
import { GlobeProjectionState } from "../../../types/globe-projection-state";

import styles from "./globe.module.css";
import { useDispatch } from "react-redux";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { useContentParams } from "../../../hooks/use-content-params";

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
  backgroundColor: string;
  onMouseEnter: () => void;
  onTouchStart: () => void;
  onChange: (view: CameraView) => void;
  onMoveStart: () => void;
  onMoveEnd: (view: CameraView) => void;
  className?: string;
  onLayerLoadingStateChange: (
    layerId: string,
    state: LayerLoadingState
  ) => void;
}


export type GlobeProps = Partial<Props>;

const EMPTY_FUNCTION = () => {};

// Animation duration in milliseconds
const ANIMATION_DURATION = 2000;

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
const dispatch = useDispatch();

  const rotationRef = useRef<{
    lat: number;
    lng: number;
  }>({ lat: view.lat, lng: view.lng });

  //const isAutoRotatingRef = useRef<boolean>(isAutoRotating);

  // We have these custom functions for autoRotating the globe and animating the flyTo
  // Ticket #1271 and #1270 reference these issues see https://github.com/orgs/ubilabs/projects/48
  //const animatedFlyTo = useCallback(
  //  (lat: number, lng: number) => {
  //    if (rotationRef.current.lng === lng && rotationRef.current.lat === lat) {
  //      return;
  //    }
  //    // Instead of the center, we have to adjust the target position so that
  //    // actual point we want to move to is rotated the right side
  //    // This is because only the right side of the globe is actually visible to the user
  //    const targetLng = lng - 55;
  //    const targetLat = lat;
  //    const startLng = rotationRef.current.lng;
  //    const startLat = rotationRef.current.lat;
  //    const deltaLng = targetLng - startLng;
  //    const deltaLat = targetLat - startLat;
  //    const steps = Math.ceil(SPEED * 60); // Assuming 60 frames per second
  //
  //    let step = 0;
  //
  //    const animate = () => {
  //      if (step < steps) {
  //        const currentLng = startLng + (deltaLng * step) / steps;
  //        const currentLat = startLat + (deltaLat * step) / steps;
  //        if (globe) {
  //          rotationRef.current.lng = currentLng;
  //          rotationRef.current.lat = currentLat;
  //          globe.setProps({
  //            cameraView: {
  //              lng: currentLng,
  //              lat: currentLat,
  //              altitude: view.altitude,
  //            },
  //          });
  //        }
  //        step++;
  //        requestAnimationFrame(animate);
  //      }
  //    };
  //
  //    animate();
  //  },
  //  [globe, view.altitude],
  //);

  //const autoRotate = useCallback(() => {
  //  rotationRef.current.lng -= 0.05;
  //  const lng = rotationRef.current.lng;
  //
  //  if (globe) {
  //    globe.setProps({
  //      cameraView: { lng, lat: view.lat, altitude: view.altitude },
  //    });
  //  }

  //  if (isAutoRotatingRef.current) {
  //    requestAnimationFrame(autoRotate);
  //  }
  //}, [globe, view.lat, view.altitude]);
  //
  //useEffect(() => {
  //  isAutoRotatingRef.current = isAutoRotating;
  //  if (globe && isAutoRotating) {
  //    autoRotate();
  //  }
  //}, [globe, autoRotate, isAutoRotating]);

  useGlobeLayers(globe, layerDetails, imageLayer);
  useGlobeMarkers(globe, markers);

  useProjectionSwitch(globe, projectionState.projection);
  useMultiGlobeSynchronization(globe, props, dispatch);

  useLayerLoadingStateUpdater(globe, props.onLayerLoadingStateChange);

  console.log("className", className);
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
      onTouchStart={() => onTouchStart()}></div>
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

  useEffect(
    () => {
      if (!containerEl) {
        return EMPTY_FUNCTION;
      }

      const newGlobe = new WebGlGlobe(containerEl, {
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
    },
    // we absolutely don't want to react to all view-changes here, so `view`
    // is left out of dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerEl],
  );

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
  useEffect(() => {
    if (!globe) {
      return EMPTY_FUNCTION;
    }
    const layers = getLayerProps(imageLayer, layerDetails);

    globe.setProps({ layers });

    // we don't reset the layers in the cleanup-function as this would lead
    // to animations not working.
    return EMPTY_FUNCTION;
  }, [globe, layerDetails, imageLayer]);
}

/**
 * Updates the markers on the globe when they become available.
 */
function useGlobeMarkers(globe: WebGlGlobe | null, markers?: Marker[]) {
  const history = useHistory();

  useEffect(() => {
    if (!globe || !markers) {
      return EMPTY_FUNCTION;
    }
    globe.setProps({
      markers: getMarkerProps(markers, (marker: Marker) => {
        if (!marker.link) {
          return;
        }

        history.push(marker.link);
      }),
    });

    return () => {
      globe.setProps({ markers: [] });
    };
  }, [history, globe, markers]);
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
function useMultiGlobeSynchronization(
  globe: WebGlGlobe | null,
  props: Props,
  dispatch: Dispatch<UnknownAction>,
) {
  const { view, active, flyTo } = props;

  const rotationRef = useRef<{
    lat: number;
    lng: number;
  }>({ lat: view.lat, lng: view.lng });

  // forward camera changes from the active view to the parent component
  useCameraChangeEvents(globe, props);
  // set camera-view unless it's the active globe
  useEffect(() => {
    if (globe && !active) {
      globe.setProps({ cameraView: view });
    }
  }, [globe, view, active]);

  // Track animation state to prevent multiple animations
  const animationRef = useRef<{
    isAnimating: boolean;
    animationId: number | null;
    lastFlyToTarget: { lat: number; lng: number } | null;
  }>({
    isAnimating: false,
    animationId: null,
    lastFlyToTarget: null
  });

  // ! Make sure to reset the FlyTo after the animation has been applied
  // That way we make sure we can use the globe view to apply movements by event handlers
  // There is probably a better way to do this?

  // incoming flyTo cameraViews are always applied
  useEffect(() => {
    // Skip entire effect if globe or flyTo is not available
    if (!globe || !flyTo) return;
    if (flyTo.isAnimated) {
        // Extract target coordinates
        const lat = flyTo.lat;
        const lng = flyTo.lng;

        // Skip if we're already at the target position
        if (rotationRef.current.lng === lng && rotationRef.current.lat === lat) {
          return;
        }

        // Skip if we're already animating to this target
        if (
          animationRef.current.isAnimating &&
          animationRef.current.lastFlyToTarget &&
          animationRef.current.lastFlyToTarget.lat === lat &&
          animationRef.current.lastFlyToTarget.lng === lng
        ) {
          return;
        }

        // Cancel any existing animation
        if (animationRef.current.isAnimating && animationRef.current.animationId !== null) {
          cancelAnimationFrame(animationRef.current.animationId);
          animationRef.current.isAnimating = false;
          animationRef.current.animationId = null;
        }

        // Set the new animation target
        animationRef.current.lastFlyToTarget = { lat, lng };
        animationRef.current.isAnimating = true;

        // Instead of the center, we have to adjust the target position so that
        // actual point we want to move to is rotated the right side
        // This is because only the right side of the globe is actually visible to the user
        const targetLng = lng - 55;
        const targetLat = lat;
        const startLng = rotationRef.current.lng;
        const startLat = rotationRef.current.lat;
        const deltaLng = targetLng - startLng;
        const deltaLat = targetLat - startLat;

        // Fixed duration: 2 seconds (2000ms)
        const animationDuration = 2000;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
          // Initialize startTime on first animation frame
          if (!startTime) startTime = timestamp;

          // Calculate progress (0 to 1) based on elapsed time
          const elapsedTime = timestamp - startTime;
          const progress = Math.min(elapsedTime / animationDuration, 1);

          // Use easeInOutQuad easing function for smoother animation
          const easedProgress = easeInOutQuad(progress);

          // Apply the current position based on progress with easing
          const currentLng = startLng + (deltaLng * easedProgress);
          const currentLat = startLat + (deltaLat * easedProgress);

          if (globe) {
            rotationRef.current.lng = currentLng;
            rotationRef.current.lat = currentLat;
            globe.setProps({
              cameraView: {
                lng: currentLng,
                lat: currentLat,
                altitude: view.altitude,
              },
            });
          }

          // Continue animation if not complete
          if (progress < 1) {
            animationRef.current.animationId = requestAnimationFrame(animate);
          } else {
            // Animation complete - ensure we reach exactly the target position
            if (globe) {
              rotationRef.current.lng = targetLng;
              rotationRef.current.lat = targetLat;
              globe.setProps({
                cameraView: {
                  lng: targetLng,
                  lat: targetLat,
                  altitude: view.altitude,
                },
              });
            }

            // Reset animation state
            animationRef.current.isAnimating = false;
            animationRef.current.animationId = null;
          dispatch(setFlyTo(null));
          }
        };

        // Start the animation
        animationRef.current.animationId = requestAnimationFrame(animate);
      } else {
        // For non-animated flyTo, cancel any ongoing animation
        if (animationRef.current.isAnimating && animationRef.current.animationId !== null) {
          cancelAnimationFrame(animationRef.current.animationId);
          animationRef.current.isAnimating = false;
          animationRef.current.animationId = null;
        }
        globe.setProps({ cameraView: flyTo });
      dispatch(setFlyTo(null));
      }
    }
    , [globe, flyTo, view.altitude]);
    // Cleanup function to cancel any ongoing animation when unmounting
    return () => {
      if (animationRef.current.animationId !== null) {
        cancelAnimationFrame(animationRef.current.animationId);
        animationRef.current.isAnimating = false;
        animationRef.current.animationId = null;
      }
    };
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
) {
  let basemapUrl = getBasemapUrl(layerDetails);
  let cloudsUrl = null;

  if (layerDetails?.basemap === "clouds") {
    cloudsUrl = getBasemapUrl({ basemap: "clouds" } as Layer);
    basemapUrl = getBasemapUrl({ basemap: config.defaultBasemap } as Layer);
  }
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

  if (cloudsUrl) {
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
): MarkerProps[] {
  const res: MarkerProps[] = [];

  for (const marker of markers) {
    const [lng, lat] = marker.position;
    // const html = getMarkerHtml(marker.title);
    const html = renderToStaticMarkup(<MarkerMarkup title={marker.title} />);

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
