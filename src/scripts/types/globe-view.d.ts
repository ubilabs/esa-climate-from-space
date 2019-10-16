export default interface GlobeView {
  destination: [number, number, number];
  orientation: {
    heading: number;
    pitch: number;
    roll: number;
  };
}
