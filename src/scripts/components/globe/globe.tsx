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
  view: GlobeView;
  projection: GlobeProjection;
  imageUrl: string | null;
  flyTo: GlobeView | null;
  onMouseEnter: () => void;
  onChange: (view: GlobeView) => void;
  onMoveEnd: (view: GlobeView) => void;
}

const Globe: FunctionComponent<Props> = ({
  view,
  projection,
  imageUrl,
  active,
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
      projection === GlobeProjection.Sphere
        ? Cesium.SceneMode.SCENE3D
        : Cesium.SceneMode.SCENE2D;
    const options = {...cesiumOptions, sceneMode};

    // create cesium viewer
    const scopedViewer = new Cesium.Viewer(ref.current, options);

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

    projection === GlobeProjection.Sphere
      ? viewer.scene.morphTo3D()
      : viewer.scene.morphTo2D();
  }, [viewer, projection]);

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
    const oldLayer = layers.length > 1 && layers.get(1);

    if (url) {
      const imageProvider = new Cesium.SingleTileImageryProvider({url});
      imageProvider.readyPromise.then(() => {
        viewer.scene.imageryLayers.addImageryProvider(imageProvider);
        // remove and destroy old layer if exists
        // we do not clean it up in the useEffect clean function because we want
        // to wait until the new layer is ready to prevent flickering
        oldLayer && setTimeout(() => layers.remove(oldLayer, true), 100);
      });
    } else if (oldLayer) {
      // remove old layer when no image should be shown anymore
      layers.remove(oldLayer, true);
    }
  }, [viewer, imageUrl]);

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
