import 'cesium/Build/Cesium/Cesium';

import {radToDeg, degToRad} from './math-helpers';

import {GlobeView} from '../types/globe-view';

const Cesium = window.Cesium;

// set the camera according to the given globe view (lng, lat in radians)
export function setGlobeView(viewer: Cesium.Viewer, view: GlobeView): void {
  const {position, orientation} = view;
  const cesiumView = {
    destination: Cesium.Cartesian3.fromDegrees(
      position.longitude,
      position.latitude,
      position.height
    ),
    orientation: {
      heading: degToRad(orientation.heading),
      pitch: degToRad(orientation.pitch),
      roll: degToRad(orientation.roll)
    }
  };

  viewer.scene.camera.setView(cesiumView);
}

// set the camera according to the given globe view (lng, lat in degrees)
export function flyToGlobeView(viewer: Cesium.Viewer, view: GlobeView): void {
  const {position, orientation} = view;
  const cesiumView = {
    destination: Cesium.Cartesian3.fromDegrees(
      position.longitude,
      position.latitude,
      position.height
    ),
    orientation: {
      heading: degToRad(orientation.heading),
      pitch: degToRad(orientation.pitch),
      roll: degToRad(orientation.roll)
    }
  };

  viewer.scene.camera.flyTo(cesiumView);
}

// get the globe view from the current cesium camera
export function getGlobeView(viewer: Cesium.Viewer): GlobeView {
  const camera = viewer.scene.camera;
  const position = camera.positionCartographic;

  return {
    position: {
      longitude: radToDeg(position.longitude),
      latitude: radToDeg(position.latitude),
      height: position.height
    },
    orientation: {
      heading: radToDeg(camera.heading),
      pitch: radToDeg(camera.pitch),
      roll: radToDeg(camera.roll)
    }
  };
}
