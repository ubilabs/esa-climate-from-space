import {GlobeState} from '../reducers/globe/index';
import {GlobeProjection} from '../types/globe-projection';

const globeState: GlobeState = {
  time: 0,
  projection: GlobeProjection.Sphere,
  view: {
    position: {
      height: 14484862,
      latitude: 0.659017,
      longitude: 0.002816
    },
    orientation: {
      heading: 0,
      pitch: -90,
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
    layerTiles:
      'https://storage.googleapis.com/esa-cfs-tiles/test/{id}/{timeIndex}',
    layerSingleImage:
      'https://storage.googleapis.com/esa-cfs-tiles/test/{id}/{timeIndex}.jpg',
    stories:
      'https://storage.googleapis.com/esa-cfs-storage/stories/stories-{lang}.json',
    story:
      'https://storage.googleapis.com/esa-cfs-storage/stories/{id}/{id}-{lang}.json'
  },
  globe: globeState
};
