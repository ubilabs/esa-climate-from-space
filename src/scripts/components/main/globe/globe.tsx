import React, {FunctionComponent, useRef, useEffect, useState} from 'react';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import {
  Cartesian3,
  Color,
  EventHelper,
  SceneMode,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  TileMapServiceImageryProvider,
  Viewer
} from 'cesium';

import {
  getGlobeView,
  setGlobeView,
  flyToGlobeView
} from '../../../libs/get-globe-view';
import {isElectron} from '../../../libs/electron/index';

import {GlobeView} from '../../../types/globe-view';
import {GlobeProjection} from '../../../types/globe-projection';
import config from '../../../config/main';
import {useMarkers} from '../../../hooks/use-markers';
import {useGlobeLayer} from '../../../hooks/use-globe-layer';

import {GlobeProjectionState} from '../../../types/globe-projection-state';
import {BasemapId} from '../../../types/basemap';
import {Marker} from '../../../types/marker-type';
import {GlobeImageLayerData} from '../../../types/globe-image-layer-data';

import styles from './globe.styl';

const cesiumOptions = {
  homeButton: false,
  fullscreenButton: false,
  sceneModePicker: false,
  infoBox: false,
  geocoder: false,
  navigationHelpButton: false,
  animation: false,
  timeline: false,
  baseLayerPicker: false,
  selectionIndicator: false,
  contextOptions: {
    webgl: {
      preserveDrawingBuffer: true
    }
  }
};

interface Props {
  active: boolean;
  view: GlobeView;
  projectionState: GlobeProjectionState;
  imageLayer: GlobeImageLayerData | null;
  basemap: BasemapId | null;
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

// keep a reference to the current basemap layer
let basemapLayer: Cesium.ImageryLayer | null = null;

function getBasemapUrl(id: BasemapId | null) {
  if (!id || !config.basemapUrls[id]) {
    return isElectron()
      ? config.basemapUrlsOffline[config.defaultBasemap]
      : config.basemapUrls[config.defaultBasemap];
  }

  return isElectron() ? config.basemapUrlsOffline[id] : config.basemapUrls[id];
}

const spinningEventHelper = new EventHelper();

const Globe: FunctionComponent<Props> = ({
  view,
  projectionState,
  imageLayer,
  basemap,
  spinning,
  active,
  flyTo,
  markers = [],
  backgroundColor,
  onMouseEnter,
  onTouchStart,
  onChange,
  onMoveEnd,
  onMouseDown
}) => {
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // make latest "active" value always accessible in camera change handler
  const isActiveRef = useRef<boolean>(active);
  isActiveRef.current = active;

  // init cesium viewer
  useEffect(() => {
    if (!ref || !ref.current) {
      return () => {};
    }

    // set correct scene mode
    const sceneMode =
      projectionState.projection === GlobeProjection.Sphere
        ? SceneMode.SCENE3D
        : SceneMode.SCENE2D;

    // create default imagery provider
    const defaultBasemapImageryProvider = new TileMapServiceImageryProvider({
      url: getBasemapUrl(basemap),
      fileExtension: 'png',
      maximumLevel: 4
    });

    const options = {
      ...cesiumOptions,
      sceneMode,
      imageryProvider: defaultBasemapImageryProvider
    };

    // create cesium viewer
    const scopedViewer = new Viewer(ref.current, options);

    // store the basemap imagery layer reference
    basemapLayer = scopedViewer.scene.imageryLayers.get(0);

    const baseColor = Color.fromCssColorString('#999999');
    scopedViewer.scene.globe.baseColor = baseColor;

    scopedViewer.scene.backgroundColor = Color.fromCssColorString(
      backgroundColor
    );

    if (scopedViewer.scene.sun) {
      scopedViewer.scene.sun.show = false;
    }

    if (scopedViewer.scene.moon) {
      scopedViewer.scene.moon.show = false;
    }

    if (scopedViewer.scene.skyBox) {
      scopedViewer.scene.skyBox.show = false;
    }

    if (scopedViewer.scene.skyAtmosphere) {
      scopedViewer.scene.skyAtmosphere.show = false;
    }

    // @ts-ignore
    if (scopedViewer.scene.globe.showGroundAtmosphere) {
      // @ts-ignore
      scopedViewer.scene.globe.showGroundAtmosphere = false;
    }
    // save viewer reference
    setViewer(scopedViewer);

    // set initial camera view
    setGlobeView(scopedViewer, view);

    // make camera change listener more sensitiv
    scopedViewer.camera.percentageChanged = 0.001;

    // add camera change listener
    scopedViewer.camera.changed.addEventListener(() => {
      isActiveRef.current && onChange(getGlobeView(scopedViewer));
    });

    // add camera move end listener
    scopedViewer.camera.moveEnd.addEventListener(() => {
      isActiveRef.current && onMoveEnd(getGlobeView(scopedViewer));
    });

    // clean up
    return () => {
      scopedViewer.destroy();
      setViewer(null);
    };
    // we use 'projection' and 'view' here only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, onChange, onMoveEnd]);

  // update mousedown handler
  useEffect(() => {
    if (!viewer) {
      return () => {};
    }

    const handler = new ScreenSpaceEventHandler(
      viewer.scene.canvas as HTMLCanvasElement
    );
    handler.setInputAction(onMouseDown, ScreenSpaceEventType.LEFT_DOWN);

    return () => {
      handler.destroy();
    };
  }, [viewer, onMouseDown]);

  // switch projections
  useEffect(() => {
    if (!viewer) {
      return;
    }

    projectionState.projection === GlobeProjection.Sphere
      ? viewer.scene.morphTo3D(projectionState.morphTime)
      : viewer.scene.morphTo2D(projectionState.morphTime);
  }, [viewer, projectionState]);

  // update position and distance when view changes
  useEffect(() => {
    if (!view || !viewer) {
      return;
    }

    // only apply view changes when they come from another globe
    if (active) {
      return;
    }

    setGlobeView(viewer, view);
  }, [viewer, view, active]);

  useGlobeLayer(viewer, imageLayer);

  // update basemap
  useEffect(() => {
    if (!viewer) {
      return;
    }

    // create default imagery provider
    const basemapProvider = new TileMapServiceImageryProvider({
      url: getBasemapUrl(basemap),
      fileExtension: 'png',
      maximumLevel: 4
    });

    basemapProvider.readyPromise.then(() => {
      const newBasemapLayer = viewer.scene.imageryLayers.addImageryProvider(
        basemapProvider,
        0
      );

      newBasemapLayer.alpha = 1;

      if (basemapLayer) {
        viewer.scene.imageryLayers.remove(basemapLayer, true);
      }

      basemapLayer = newBasemapLayer;
    });
  }, [viewer, basemap]);

  // fly to location
  useEffect(() => {
    if (!viewer || !flyTo) {
      return;
    }

    flyToGlobeView(viewer, flyTo);
  }, [viewer, flyTo]);

  // update spinning
  useEffect(() => {
    if (!viewer) {
      return;
    }

    if (spinning) {
      setTimeout(() => {
        let lastNow = Date.now();

        const spin = () => {
          const now = Date.now();
          const spinRate = 0.08;
          const delta = (now - lastNow) / 1000;
          lastNow = now;
          viewer.scene.camera.rotate(Cartesian3.UNIT_Z, spinRate * delta);
        };

        spinningEventHelper.add(viewer.clock.onTick, spin);
      }, projectionState.morphTime * 1000);
    } else {
      spinningEventHelper.removeAll();
    }
  }, [spinning, viewer, projectionState.morphTime]);

  useMarkers(viewer, markers);

  return (
    <div
      className={styles.globe}
      onMouseEnter={() => onMouseEnter()}
      onTouchStart={() => onTouchStart()}
      ref={ref}
    />
  );
};

export default Globe;
