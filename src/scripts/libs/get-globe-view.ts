import 'cesium/Build/Cesium/Cesium';
import {View} from '../components/globes/globes';

interface CesiumView {
  destination: Cesium.Cartesian3;
  orientation: {
    heading: number;
    pitch: number;
    roll: number;
  };
}

export function cesiumViewToPlainView(cesiumView: CesiumView): View {
  const {destination} = cesiumView;

  return {
    ...cesiumView,
    destination: [destination.x, destination.y, destination.z]
  };
}

export function plainViewToCesiumView(plainView: View): CesiumView {
  const {destination} = plainView;

  return {
    ...plainView,
    destination: window.Cesium.Cartesian3.fromArray(destination)
  };
}

// get the position and camera distance from a cesium viewer
export default function getGlobeView(viewer: Cesium.Viewer): View {
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
