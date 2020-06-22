import {GlobeState} from '../reducers/globe/index';

import {GlobeProjection} from '../types/globe-projection';

const globeState: GlobeState = {
  time: Date.now(),
  projectionState: {
    projection: GlobeProjection.Sphere,
    morphTime: 2
  },
  view: {
    position: {
      height: 25003000,
      latitude: 0,
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
    layer: `https://storage.googleapis.com/esa-cfs-tiles/${version}/{id}/metadata.json`,
    layerTiles: `https://storage.googleapis.com/esa-cfs-tiles/${version}/{id}/tiles/{timeIndex}/{z}/{x}/{reverseY}.png`,
    layerOfflinePackage: `https://storage.googleapis.com/esa-cfs-tiles/${version}/{id}/package.zip`,
    storyOfflinePackage: `https://storage.googleapis.com/esa-cfs-storage/${version}/stories/{id}/package.zip`,
    storyMediaBase: `https://storage.googleapis.com/esa-cfs-storage/${version}/stories/{id}`,
    stories: `https://storage.googleapis.com/esa-cfs-storage/${version}/stories/stories-{lang}.json`,
    story: `https://storage.googleapis.com/esa-cfs-storage/${version}/stories/{id}/{id}-{lang}.json`
  },
  basemapTilesUrl: `https://storage.googleapis.com/esa-cfs-tiles/${version}/basemap/`,
  globe: globeState,
  share: {
    facebook:
      'https://www.facebook.com/sharer/sharer.php?u={currentUrl}&text=ESAClimateFromSpace',
    twitter:
      'http://twitter.com/intent/tweet?status=ESA%20Climate%20From%20Space&url={currentUrl}'
  }
};
