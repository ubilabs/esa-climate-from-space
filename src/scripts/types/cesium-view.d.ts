export interface CesiumView {
  destination: Cesium.Cartesian3;
  orientation: {
    heading: number;
    pitch: number;
    roll: number;
  };
}
