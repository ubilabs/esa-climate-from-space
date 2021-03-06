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
      height: 42430000,
      latitude: 25,
      longitude: 0
    },
    orientation: {
      heading: 360,
      pitch: -90,
      roll: 0
    }
  },
  spinning: true
};

// @ts-ignore - injected via webpack's define plugin
const version = INFO_VERSION;
const baseUrlTiles = `https://storage.googleapis.com/esa-cfs-tiles/${version}`;
let baseUrlStorage = 'http://localhost:8080/storage';

// use content from local server
// @ts-ignore - injected via webpack's define plugin
if (PRODUCTION) {
  baseUrlStorage = `https://storage.googleapis.com/esa-cfs-storage/${version}`;
}

const basemapUrls = {
  land: `${baseUrlTiles}/basemaps/land`,
  ocean: `${baseUrlTiles}/basemaps/ocean`,
  atmosphere: `${baseUrlTiles}/basemaps/atmosphere`,
  blue: `${baseUrlTiles}/basemaps/blue`,
  dark: `${baseUrlTiles}/basemaps/dark`
};

const basemapUrlsOffline = {
  land: 'basemaps/land',
  ocean: 'basemaps/ocean',
  atmosphere: 'basemaps/atmosphere',
  blue: 'basemaps/blue',
  dark: 'basemaps/dark'
};

const downloadUrls = {
  windows: `https://storage.googleapis.com/esa-cfs-versions/electron/${version}/esa-climate-from-space-${version}-win.exe`,
  macOS: `https://storage.googleapis.com/esa-cfs-versions/electron/${version}/esa-climate-from-space-${version}-mac.zip`,
  linux: `https://storage.googleapis.com/esa-cfs-versions/electron/${version}/esa-climate-from-space-${version}-linux.zip`
};

export default {
  api: {
    layers: `${baseUrlStorage}/layers/layers-{lang}.json`,
    layer: `${baseUrlTiles}/{id}/metadata.json`,
    layerTiles: `${baseUrlTiles}/{id}/tiles/{timeIndex}/{z}/{x}/{reverseY}.png`,
    layerImage: `${baseUrlTiles}/{id}/tiles/{timeIndex}/full.png`,
    layerGalleryImage: `${baseUrlTiles}/{id}/tiles/{timeIndex}/full.jpg`,
    layerOfflinePackage: `${baseUrlTiles}/{id}/package.zip`,
    layerIcon: `${baseUrlTiles}/{id}/icon.png`,
    storyOfflinePackage: `${baseUrlStorage}/stories/{id}/package.zip`,
    storyMediaBase: `${baseUrlStorage}/stories/{id}`,
    stories: `${baseUrlStorage}/stories/stories-{lang}.json`,
    story: `${baseUrlStorage}/stories/{id}/{id}-{lang}.json`
  },
  defaultBasemap: 'land' as keyof typeof basemapUrls,
  basemapUrls,
  basemapUrlsOffline,
  globe: globeState,
  share: {
    facebook:
      'https://www.facebook.com/sharer/sharer.php?u={currentUrl}&text=ESAClimateFromSpace',
    twitter:
      'http://twitter.com/intent/tweet?text=ESA%20Climate%20From%20Space&url={currentUrl}'
  },
  planeratyVisionsLogo: 'assets/images/planetary-visions.png',
  ubilabsWebsite: 'https://ubilabs.net',
  planetaryVisionsWebsite: 'http://planetaryvisions.com/',
  githubRepo: 'https://github.com/ubilabs/esa-climate-from-space',
  cciWebsite: 'https://climate.esa.int/',
  esaWebsite: 'https://www.esa.int/',
  legendImage: `${baseUrlTiles}/{id}/legend.png`,
  downloadUrls,
  localStorageLanguageKey: 'language',
  delay: 5000,
  feedbackUrl: 'https://climate.esa.int/en/helpdesk/'
};
