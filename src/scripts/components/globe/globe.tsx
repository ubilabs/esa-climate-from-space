import React, {FunctionComponent, useRef, useEffect, useState} from 'react';

import {
  getGlobeView,
  setGlobeView,
  flyToGlobeView
} from '../../libs/get-globe-view';

import {GlobeView} from '../../types/globe-view';
import {GlobeProjection} from '../../types/globe-projection';

import 'cesium/Source/Widgets/widgets.css';
import 'cesium/Build/Cesium/Cesium';

import {GlobeProjectionState} from '../../types/globe-projection-state';

import styles from './globe.styl';

const Cesium = window.Cesium;
// set global base url
Cesium.buildModuleUrl.setBaseUrl('./cesium/');
// we do not use cesium ion tile server
// @ts-ignore
Cesium.Ion.defaultAccessToken = '';
// create default imagery provider
// @ts-ignore
const tileUrl = window.Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII');
const imageryProvider = window.Cesium.createTileMapServiceImageryProvider({
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
  layerType?: string;
  view: GlobeView;
  projectionState: GlobeProjectionState;
  imageUrl: string | null;
  flyTo: GlobeView | null;
  onMouseEnter: () => void;
  onChange: (view: GlobeView) => void;
  onMoveEnd: (view: GlobeView) => void;
}

const Globe: FunctionComponent<Props> = ({
  view,
  projectionState,
  imageUrl,
  active,
  layerType,
  flyTo,
  onMouseEnter,
  onChange,
  onMoveEnd
}) => {
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);
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
        ? Cesium.SceneMode.SCENE3D
        : Cesium.SceneMode.SCENE2D;

    const options = {...cesiumOptions, sceneMode};

    // create cesium viewer
    const scopedViewer = new Cesium.Viewer(ref.current, options);

    const color = new Cesium.Color(0.12, 0.12, 0.12, 1);
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

    const url = imageUrl;
    const layers = viewer.scene.imageryLayers;

    if (url) {
      const imageProvider =
        layerType === 'tiles'
          ? new Cesium.UrlTemplateImageryProvider({
              url,
              tilingScheme: new Cesium.GeographicTilingScheme(),
              minimumLevel: 0,
              maximumLevel: 3,
              tileWidth: 270,
              tileHeight: 270
            })
          : new Cesium.SingleTileImageryProvider({url});

      imageProvider.readyPromise.then(() => {
        const newLayer = viewer.scene.imageryLayers.addImageryProvider(
          imageProvider
        );
        // @ts-ignore
        newLayer.minificationFilter = Cesium.TextureMinificationFilter.NEAREST;
        // @ts-ignore
        newLayer.magnificationFilter =
          // @ts-ignore
          Cesium.TextureMagnificationFilter.NEAREST;

        // remove and destroy old layers if they exist
        // we do not clean it up in the useEffect clean function because we want
        // to wait until the new layer is ready to prevent flickering
        setTimeout(() => {
          for (let i = 0; i < layers.length; i++) {
            const layer = layers.get(i);
            if (i !== 0 && layer !== newLayer) {
              layers.remove(layer, true);
            }
          }
        }, 100);
      });
    } else if (layers.length > 1) {
      // remove old layers when no image should be shown anymore
      for (let i = 1; i < layers.length; i++) {
        const layer = layers.get(i);
        layers.remove(layer, true);
      }
    }
  }, [layerType, viewer, imageUrl]);

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
      ref={ref}
    />
  );
};

export default Globe;
