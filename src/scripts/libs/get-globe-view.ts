import 'cesium/Build/Cesium/Cesium';

import {CesiumView} from '../types/cesium-view';
import {GlobeView} from '../types/globe-view';

export function cesiumViewToPlainView(cesiumView: CesiumView): GlobeView {
  const {destination} = cesiumView;

  return {
    ...cesiumView,
    destination: [destination.x, destination.y, destination.z]
  };
}

export function plainViewToCesiumView(plainView: GlobeView): CesiumView {
  const {destination} = plainView;

  return {
    ...plainView,
    destination: window.Cesium.Cartesian3.fromArray(destination)
  };
}

// get the position and camera distance from a cesium viewer
export default function getGlobeView(viewer: Cesium.Viewer): GlobeView {
  const camera = viewer.scene.camera;
  const destination = camera.positionWC;

  const cesiumView = {
    destination,
    orientation: {
      heading: camera.heading,
      pitch: camera.pitch,
      roll: camera.roll
    }
  };

  return cesiumViewToPlainView(cesiumView);
}
