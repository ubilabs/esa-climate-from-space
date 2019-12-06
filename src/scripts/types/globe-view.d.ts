export interface GlobeView {
  position: {
    longitude: number;
    latitude: number;
    height: number;
  };
  orientation: {
    heading: number;
    pitch: number;
    roll: number;
  };
}
