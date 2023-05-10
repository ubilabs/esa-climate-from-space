import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState
} from 'react';

import cx from 'classnames';

import {LayerProps, MarkerProps, WebGlGlobe} from '@ubilabs/esa-webgl-globe';
import GLOBE_WORKER_URL from '@ubilabs/esa-webgl-globe/worker?url';

import {GlobeView} from '../../../types/globe-view';

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

WebGlGlobe.setTileSelectorWorkerUrl(GLOBE_WORKER_URL);

interface Props {
  active: boolean;
  view: GlobeView;
  projectionState: GlobeProjectionState;
  imageLayer: GlobeImageLayerData | null;
  layerDetails: Layer | null;
  spinning: boolean;
  flyTo: GlobeView | null;
  markers?: Marker[];
  backgroundColor: string;
  onMouseEnter: () => void;
  onTouchStart: () => void;
  onChange: (view: GlobeView) => void;
  onMoveEnd: (view: GlobeView) => void;
  onMouseDown: () => void;
}

const Globe: FunctionComponent<Props> = props => {
  const {
    // view,
    // projectionState,
    // spinning,
    // active,
    // flyTo,
    // markers = [],
    // backgroundColor,
    onMouseEnter,
    onTouchStart
    // onChange,
    // onMoveEnd,
    // onMouseDown
  } = props;

  const [containerRef] = useWebGlGlobe(props);

  return (
    <div
      ref={containerRef}
      className={cx(styles.globe, styles.fadeIn)}
      onMouseEnter={() => onMouseEnter()}
      onTouchStart={() => onTouchStart()}></div>
  );
};

function useCallbackRef() {
  const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);
  const containerRef = useCallback(
    (node: HTMLElement | null) => setContainerEl(node),
    []
  );

  return [containerRef, containerEl] as const;
}

function useWebGlGlobe(props: Props) {
  const [containerRef, containerEl] = useCallbackRef();
  const [globe, setGlobe] = useState<WebGlGlobe | null>(null);

  console.log('useWebGlGlobe()', globe, props);

  // ----
  // create WebGlGlobe instance once container is available
  useEffect(() => {
    if (!containerEl) {
      return () => {};
    }

    console.log('useWebGlGlobe(): create globe instance');
    const _globe = new WebGlGlobe(containerEl);

    setGlobe(_globe);

    return () => _globe.destroy();
  }, [containerEl]);

  // ----
  // update layers
  useEffect(() => {
    if (!globe) {
      return () => {};
    }
    const layers = getLayers(props.imageLayer, props.layerDetails);

    console.log('setLayers', layers);
    globe.setProps({layers});

    return () => {};
    // return () => globe.setProps({layers: []});
  }, [globe, props.layerDetails, props.imageLayer]);

  // ----
  // add and remove markers
  const history = useHistory();

  useEffect(() => {
    if (!globe || !props.markers) {
      return () => {};
    }

    globe.setProps({
      markers: getMarkers(props.markers, (marker: Marker) => {
        if (!marker.link) {
          return;
        }

        history.push(marker.link);
      })
    });

    return () => {
      globe.setProps({markers: []});
    };
  }, [history, globe, props.markers]);

  return [containerRef, globe] as const;
}

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
      offset: [-16, -16],
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
