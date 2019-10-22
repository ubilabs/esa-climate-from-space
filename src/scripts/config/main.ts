import {GlobeState} from '../reducers/globe/index';
import {GlobeProjection} from '../types/globe-projection';

const globeState: GlobeState = {
  projection: GlobeProjection.Sphere,
  view: {
    position: {
      height: 14484862,
      latitude: 0.659017,
      longitude: 0.002816
    },
    orientation: {
      heading: Math.PI * 2,
      pitch: Math.PI / -2,
      roll: 0
    }
  }
};

export default {
  api: {
    layers:
      'https://storage.googleapis.com/esa-cfs-storage/layers/layers-{lang}.json',
    layer:
      'https://storage.googleapis.com/esa-cfs-storage/layers/{id}/metadata.json',
    stories: 'https://storage.googleapis.com/esa-cfs-storage/stories'
  },
  globe: globeState
};
