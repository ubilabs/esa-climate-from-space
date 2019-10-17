import 'cesium/Build/Cesium/Cesium';

import {GlobeView} from '../types/globe-view';

const Cesium = window.Cesium;

// set the camera according to the given globe view
export function setGlobeView(viewer: Cesium.Viewer, view: GlobeView): void {
  const {position, orientation} = view;
  const cesiumView = {
    destination: Cesium.Cartesian3.fromRadians(
      position.longitude,
      position.latitude,
      position.height
    ),
    orientation
  };

  viewer.scene.camera.setView(cesiumView);
}

// get the globe view from the current cesium camera
export function getGlobeView(viewer: Cesium.Viewer): GlobeView {
  const camera = viewer.scene.camera;
  const position = camera.positionCartographic;

  return {
    position: {
      longitude: position.longitude,
      latitude: position.latitude,
      height: position.height
    },
    orientation: {
      heading: camera.heading,
      pitch: camera.pitch,
      roll: camera.roll
    }
  };
}
