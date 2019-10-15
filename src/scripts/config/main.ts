import {GlobeState} from '../reducers/globe/index';
import {GlobeProjection} from '../actions/set-globe-projection';

const globeState: GlobeState = {
  projection: GlobeProjection.Sphere,
  view: {
    destination: [18888448, 279066, 15407835],
    orientation: {
      heading: 6.2,
      pitch: -1.59,
      roll: 0
    }
  }
};

export default {
  api: {
    layers: 'https://storage.googleapis.com/esa-cfs-storage/layers',
    stories: 'https://storage.googleapis.com/esa-cfs-storage/stories'
  },
  globe: globeState
};
