import {GlobeState} from '../reducers/globe/index';
import {GlobeProjection} from '../types/globe-projection';

const globeState: GlobeState = {
  time: 0,
  projectionState: {
    projection: GlobeProjection.Sphere,
    morphTime: 2
  },
  view: {
    position: {
      height: 25003000,
      latitude: 21.5,
      longitude: -0.32
    },
    orientation: {
      heading: 360,
      pitch: -90,
      roll: 0
    }
  }
};

// @ts-ignore - injected via webpack's define plugin
const version = INFO_VERSION;

export default {
  api: {
    layers: `https://storage.googleapis.com/esa-cfs-storage/${version}/layers/layers-{lang}.json`,
    layer: `https://storage.googleapis.com/esa-cfs-storage/${version}/layers/{id}/metadata.json`,
    layerTiles: `https://storage.googleapis.com/esa-cfs-tiles/${version}/{id}/{timeIndex}/{z}/{y}/{x}.png`,
    layerSingleImage: `https://storage.googleapis.com/esa-cfs-tiles/${version}/{id}/{timeIndex}.jpg`,
    stories: `https://storage.googleapis.com/esa-cfs-storage/${version}/stories/stories-{lang}.json`,
    story: `https://storage.googleapis.com/esa-cfs-storage/${version}/stories/{id}/{id}-{lang}.json`
  },
  globe: globeState
};
