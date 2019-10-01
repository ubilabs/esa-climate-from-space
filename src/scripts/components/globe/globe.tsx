import React, {FunctionComponent, useRef, useEffect, useState} from 'react';

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
  const ref = useRef();
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    if (!ref || !ref.current) {
      return;
    }

    const viewer = new Cesium.Viewer(ref.current, viewerOptions);
    return () => {
      viewer.destroy();
      setViewer(null);
    };
  }, [ref]);

  return <div className={styles.globe} ref={ref} />;
};

export default Globe;
