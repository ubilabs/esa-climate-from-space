import React, {FunctionComponent, useRef, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {projectionSelector} from '../../reducers/projection';

import 'cesium/Source/Widgets/widgets.css';
import 'cesium/Build/Cesium/Cesium';

import styles from './globe.styl';

// set global base url
const Cesium = window.Cesium;
Cesium.buildModuleUrl.setBaseUrl('./cesium/');

const viewerOptions = {
  homeButton: false,
  fullscreenButton: false,
  sceneModePicker: false,
  infoBox: false,
  geocoder: false,
  navigationHelpButton: false,
  animation: false,
  timeline: false,
  baseLayerPicker: false
};

const Globe: FunctionComponent<{}> = () => {
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);
  const projection = useSelector(projectionSelector);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref || !ref.current) {
      return () => {};
    }

    const scopedViewer = new Cesium.Viewer(ref.current, viewerOptions);
    setViewer(scopedViewer);

    return () => scopedViewer.destroy();
  }, [ref]);

  useEffect(() => {
    if (!viewer) {
      return;
    }

    viewer.scene.mode = Cesium.SceneMode.SCENE3D;
  }, [viewer, projection]);

  return <div className={styles.globe} ref={ref} />;
};

export default Globe;
