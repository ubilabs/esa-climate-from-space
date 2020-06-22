import React, {FunctionComponent, useRef, useEffect, useState} from 'react';

import {
  getGlobeView,
  setGlobeView,
  flyToGlobeView
} from '../../libs/get-globe-view';

import {GlobeView} from '../../types/globe-view';
import {GlobeProjection} from '../../types/globe-projection';

import 'cesium/Build/Cesium/Widgets/widgets.css';
import {
  Viewer,
  SceneMode,
  Color,
  GeographicTilingScheme,
  TileMapServiceImageryProvider,
  UrlTemplateImageryProvider,
  TextureMinificationFilter,
  TextureMagnificationFilter,
  buildModuleUrl
} from 'cesium';

import {GlobeProjectionState} from '../../types/globe-projection-state';

import styles from './globe.styl';

// create default imagery provider
const tileUrl = buildModuleUrl('Assets/Textures/NaturalEarthII');
const imageryProvider = new TileMapServiceImageryProvider({
  url: tileUrl
});

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
  imageryProvider
};

interface Props {
  active: boolean;
  view: GlobeView;
  projectionState: GlobeProjectionState;
  tilesUrl: string | null;
  zoomLevels: number;
  flyTo: GlobeView | null;
  onMouseEnter: () => void;
  onTouchStart: () => void;
  onChange: (view: GlobeView) => void;
  onMoveEnd: (view: GlobeView) => void;
}

const Globe: FunctionComponent<Props> = ({
  view,
  projectionState,
  tilesUrl,
  zoomLevels,
  active,
  flyTo,
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

    const options = {...cesiumOptions, sceneMode};

    // create cesium viewer
    const scopedViewer = new Viewer(ref.current, options);

    const color = Color.fromCssColorString('#10161A');

    scopedViewer.scene.backgroundColor = color;

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

  // fly to location
  useEffect(() => {
    if (!viewer || !flyTo) {
      return;
    }

    flyToGlobeView(viewer, flyTo);
  }, [viewer, flyTo]);

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
