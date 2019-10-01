import React, {FunctionComponent, useRef, useEffect} from 'react';

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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref || !ref.current) {
      return () => {};
    }

    const scopedViewer = new Cesium.Viewer(ref.current, viewerOptions);

    return () => scopedViewer.destroy();
  }, [ref]);

  return <div className={styles.globe} ref={ref} />;
};

export default Globe;
