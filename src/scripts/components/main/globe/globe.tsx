import React, {FunctionComponent, useRef, useEffect, useState} from 'react';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import {
  Viewer,
  SceneMode,
  Color,
  GeographicTilingScheme,
  TileMapServiceImageryProvider,
  UrlTemplateImageryProvider,
  TextureMinificationFilter,
  TextureMagnificationFilter
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

import {GlobeProjectionState} from '../../../types/globe-projection-state';
import {BasemapId} from '../../../types/basemap';
import {Marker} from '../../../types/marker-type';

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
  tilesUrl: string | null;
  basemap: BasemapId | null;
  zoomLevels: number;
  flyTo: GlobeView | null;
  markers?: Marker[];
  backgroundColorString: string;
  onMouseEnter: () => void;
  onTouchStart: () => void;
  onChange: (view: GlobeView) => void;
  onMoveEnd: (view: GlobeView) => void;
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

const Globe: FunctionComponent<Props> = ({
  view,
  projectionState,
  tilesUrl,
  basemap,
  zoomLevels,
  active,
  flyTo,
  markers = [],
  backgroundColorString,
  onMouseEnter,
  onTouchStart,
  onChange,
  onMoveEnd
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

    const backgroundColor = Color.fromCssColorString(backgroundColorString);

    scopedViewer.scene.backgroundColor = backgroundColor;

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

  // update layer image when url changes
  useEffect(() => {
    if (!viewer) {
      return;
    }

    const layers = viewer.scene.imageryLayers;

    if (tilesUrl) {
      const imageProvider = new UrlTemplateImageryProvider({
        url: tilesUrl,
        tilingScheme: new GeographicTilingScheme(),
        minimumLevel: 0,
        maximumLevel: zoomLevels - 1,
        tileWidth: 256,
        tileHeight: 256
      });

      imageProvider.readyPromise.then(() => {
        const newLayer = viewer.scene.imageryLayers.addImageryProvider(
          imageProvider
        );
        // @ts-ignore
        newLayer.minificationFilter = TextureMinificationFilter.NEAREST;
        // @ts-ignore
        newLayer.magnificationFilter = TextureMagnificationFilter.NEAREST;
        newLayer.alpha = 1;

        // remove and destroy old layers if they exist
        // we do not clean it up in the useEffect clean function because we want
        // to wait until the new layer is ready to prevent flickering
        const layersToRemove: Cesium.ImageryLayer[] = [];

        for (let i = 0; i < layers.length; i++) {
          const layer = layers.get(i);
          if (i !== 0 && layer !== newLayer) {
            layersToRemove.push(layer);
          }
        }

        setTimeout(() => {
          // eslint-disable-next-line max-nested-callbacks
          layersToRemove.forEach(layer => layers.remove(layer, true));
        }, 500);
      });
    } else if (layers.length > 1) {
      // remove old layers when no image should be shown anymore
      for (let i = 1; i < layers.length; i++) {
        const layer = layers.get(i);
        layers.remove(layer, true);
      }
    }
  }, [viewer, tilesUrl, zoomLevels]);

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
