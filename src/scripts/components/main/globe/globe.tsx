import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

import cx from 'classnames';

import {
  CameraView,
  LayerProps,
  MarkerProps,
  RenderMode,
  WebGlGlobe,
  WebGlGlobeEventMap
} from '@ubilabs/esa-webgl-globe';
import GLOBE_WORKER_URL from '@ubilabs/esa-webgl-globe/worker?url';

import {GlobeProjectionState} from '../../../types/globe-projection-state';
import {Layer} from '../../../types/layer';
import {Marker} from '../../../types/marker-type';
import {GlobeImageLayerData} from '../../../types/globe-image-layer-data';

import {isElectron} from '../../../libs/electron';
import {BasemapId} from '../../../types/basemap';
import {getMarkerHtml} from './get-marker-html';
import {LayerType} from '../../../types/globe-layer-type';
import {useHistory} from 'react-router-dom';
import config from '../../../config/main';

import styles from './globe.module.styl';
import {GlobeProjection} from '../../../types/globe-projection';

type LayerLoadingStateChangedEvent =
  WebGlGlobeEventMap['layerLoadingStateChanged'];

WebGlGlobe.setTileSelectorWorkerUrl(GLOBE_WORKER_URL);

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
}

const EMPTY_FUNCTION = () => {};

const Globe: FunctionComponent<Props> = props => {
  const {
    view,
    projectionState,
    onMouseEnter,
    onTouchStart,
    layerDetails,
    imageLayer,
    markers
  } = props;

  const [containerRef, globe] = useWebGlGlobe(view);
  const initialTilesLoaded = useInitialBasemapTilesLoaded(globe);

  useGlobeLayers(globe, layerDetails, imageLayer);
  useGlobeMarkers(globe, markers);

  useProjectionSwitch(globe, projectionState.projection);
  useMultiGlobeSynchronization(globe, props);

  // fixme: add auto-rotate functionality

  return (
    <div
      ref={containerRef}
      className={cx(styles.globe, initialTilesLoaded && styles.fadeIn)}
      onMouseEnter={() => onMouseEnter()}
      onTouchStart={() => onTouchStart()}></div>
  );
};

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

  useEffect(() => {
    if (!containerEl) {
      return EMPTY_FUNCTION;
    }

    const newGlobe = new WebGlGlobe(containerEl, {cameraView: view});

    setGlobe(newGlobe);

    return () => newGlobe.destroy();
  }, [containerEl]);

  return [containerRef, globe] as const;
}

/**
 * Updates the globe layers as soon as available.
 */
function useGlobeLayers(
  globe: WebGlGlobe | null,
  layerDetails: Layer | null,
  imageLayer: GlobeImageLayerData | null
) {
  useEffect(() => {
    if (!globe) {
      return EMPTY_FUNCTION;
    }

    globe.setProps({layers: getLayers(imageLayer, layerDetails)});

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
      markers: getMarkers(markers, (marker: Marker) => {
        if (!marker.link) {
          return;
        }

        history.push(marker.link);
      })
    });

    return () => {
      globe.setProps({markers: []});
    };
  }, [history, globe, markers]);
}

/**
 * Manages a single state-variable indicating wether the first tiles of the
 * basemaps have been loaded.
 */
function useInitialBasemapTilesLoaded(globe: WebGlGlobe | null) {
  const [initalTilesLoaded, setInitialTilesLoaded] = useState(false);

  const handleLoadingStateChange = useCallback(
    (ev: LayerLoadingStateChangedEvent) => {
      const {layer, state} = ev.detail;
      if (layer.id === 'basemap' && state === 'ready') {
        setInitialTilesLoaded(true);
      }
    },
    []
  );

  useEffect(() => {
    if (!globe) {
      return EMPTY_FUNCTION;
    }

    globe.addEventListener(
      'layerLoadingStateChanged',
      handleLoadingStateChange
    );

    return () => {
      globe.removeEventListener(
        'layerLoadingStateChanged',
        handleLoadingStateChange
      );
    };
  }, [globe, handleLoadingStateChange]);

  return initalTilesLoaded;
}

function useProjectionSwitch(
  globe: WebGlGlobe | null,
  projection: GlobeProjection
) {
  useEffect(() => {
    if (!globe) {
      return;
    }

    const renderMode = (
      projection === GlobeProjection.Sphere ? 'globe' : 'map'
    ) as RenderMode;

    globe.setProps({renderMode});
  }, [globe, projection]);
}

/**
 * Integrate the globe with the external view-state events and props
 * (view / flyTo / onChange).
 */
function useMultiGlobeSynchronization(globe: WebGlGlobe | null, props: Props) {
  const {view, active, flyTo} = props;

  // forward camera changes from the active view to the parent component
  useCameraChangeEvents(globe, props);

  // set camera-view unless it's the active globe
  useEffect(() => {
    if (globe && !active) {
      globe.setProps({cameraView: view});
    }
  }, [globe, view, active]);

  // incoming flyTo cameraViews are always applied
  useEffect(() => {
    if (globe && flyTo) {
      globe.setProps({cameraView: flyTo});
    }
  }, [globe, flyTo]);
}

/**
 * Call the onChange callback from the props from an active globe.
 * @param globe
 * @param props
 */
function useCameraChangeEvents(globe: WebGlGlobe | null, props: Props) {
  const {active, onMoveStart, onChange, onMoveEnd} = props;

  const ref = useRef({
    timerId: 0,
    isMoving: false,
    lastCameraView: null as CameraView | null
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
    [onMoveStart, onChange, onMoveEnd]
  );

  useEffect(() => {
    if (!globe || !active) {
      return EMPTY_FUNCTION;
    }

    globe.addEventListener('cameraViewChanged', handleViewChanged);

    return () => {
      // there could be a leftover timer running
      // eslint-disable-next-line react-hooks/exhaustive-deps
      window.clearTimeout(ref.current.timerId);
      globe.removeEventListener('cameraViewChanged', handleViewChanged);
    };
  }, [globe, active, handleViewChanged]);
}

// ----
// utility functions
// ----
function getLayers(
  imageLayer: GlobeImageLayerData | null,
  layerDetails: Layer | null
) {
  const basemapUrl = getBasemapUrl(layerDetails);
  const basemapMaxZoom = getBasemapMaxZoom(layerDetails);

  const layers = [
    {
      id: 'basemap',
      zIndex: 0,
      minZoom: 1,
      maxZoom: basemapMaxZoom,
      urlParameters: {},
      getUrl: ({x, y, zoom}) => `${basemapUrl}/${zoom}/${x}/${y}.png`
    } as LayerProps
  ];

  if (imageLayer && layerDetails) {
    const {id, url} = imageLayer;
    const {type = LayerType.Image} = layerDetails;

    layers.push({
      id,
      zIndex: 1,
      minZoom: 1,
      maxZoom: layerDetails.zoomLevels,
      type: type === LayerType.Image ? 'image' : 'tile',
      urlParameters: {},
      getUrl:
        type === LayerType.Image
          ? () => url
          : ({x, y, zoom}) =>
              url
                .replace('{x}', String(x))
                .replace('{reverseY}', String(y))
                .replace('{z}', String(zoom))
    });
  }

  return layers;
}

function getMarkers(
  markers: Marker[],
  onClick: (marker: Marker) => void
): MarkerProps[] {
  const res: MarkerProps[] = [];

  for (const marker of markers) {
    const [lng, lat] = marker.position;
    const html = getMarkerHtml(marker.title);

    if (!marker.link) {
      console.error('marker witout link!', marker);
      continue;
    }

    res.push({
      lat,
      lng,
      html,
      id: marker.link,
      onClick: () => onClick(marker)
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
