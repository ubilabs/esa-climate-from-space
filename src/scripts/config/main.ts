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
      height: 23840000,
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

// @ts-ignore - injected via vite
const version = INFO_VERSION;
const baseUrlTiles = `https://storage.googleapis.com/esa-cfs-tiles/${version}`;
let baseUrlStorage = '/';

// use content from local server
// @ts-ignore - injected via vite
if (import.meta.env.PROD) {
  baseUrlStorage = `https://storage.googleapis.com/esa-cfs-storage/${version}/`;
}

type BasemapId = 'atmosphere' | 'blue' | 'colored' | 'dark' | 'land' | 'ocean';

const basemapMaxZoom: {[id in BasemapId]: number} = {
  atmosphere: 4,
  blue: 4,
  colored: 5,
  dark: 4,
  land: 4,
  ocean: 4
} as const;

const basemapUrls: {[id in BasemapId]: string} = {
  land: `${baseUrlTiles}/basemaps/land`,
  ocean: `${baseUrlTiles}/basemaps/ocean`,
  atmosphere: `${baseUrlTiles}/basemaps/atmosphere`,
  blue: `${baseUrlTiles}/basemaps/blue`,
  dark: `${baseUrlTiles}/basemaps/dark`,
  colored: `${baseUrlTiles}/basemaps/colored`
} as const;

const basemapUrlsOffline: {[id in BasemapId]: string} = {
  land: 'basemaps/land',
  ocean: 'basemaps/ocean',
  atmosphere: 'basemaps/atmosphere',
  blue: 'basemaps/blue',
  dark: 'basemaps/dark',
  colored: 'basemaps/colored'
} as const;

const downloadUrls = {
  windows: `https://storage.googleapis.com/esa-cfs-versions/electron/${version}/esa-climate-from-space-${version}-win.exe`,
  macOS: `https://storage.googleapis.com/esa-cfs-versions/electron/${version}/esa-climate-from-space-${version}-mac.zip`,
  linux: `https://storage.googleapis.com/esa-cfs-versions/electron/${version}/esa-climate-from-space-${version}-linux.zip`
} as const;

export default {
  api: {
    layers: `${baseUrlStorage}layers/layers-{lang}.json`,
    layer: `${baseUrlTiles}/{id}/metadata.json`,
    layerTiles: `${baseUrlTiles}/{id}/tiles/{timeIndex}/{z}/{x}/{reverseY}.png`,
    layerImage: `${baseUrlTiles}/{id}/tiles/{timeIndex}/full.png`,
    layerGalleryImage: `${baseUrlTiles}/{id}/tiles/{timeIndex}/full.jpg`,
    layerOfflinePackage: `${baseUrlTiles}/{id}/package.zip`,
    layerIcon: `${baseUrlTiles}/{id}/icon.png`,
    storyOfflinePackage: `${baseUrlStorage}stories/{id}/package.zip`,
    storyMediaBase: `${baseUrlStorage}stories/{id}`,
    stories: `${baseUrlStorage}stories/stories-{lang}.json`,
    story: `${baseUrlStorage}stories/{id}/{id}-{lang}.json`
  },
  defaultBasemap: 'colored' as BasemapId,
  defaultLayerBasemap: 'land' as BasemapId,
  basemapUrls,
  basemapUrlsOffline,
  basemapMaxZoom,
  globe: globeState,
  share: {
    facebook:
      'https://www.facebook.com/sharer/sharer.php?u={currentUrl}&text=ESAClimateFromSpace',
    twitter:
      'http://twitter.com/intent/tweet?text=ESA%20Climate%20From%20Space&url={currentUrl}'
  },
  planeratyVisionsLogo: 'assets/images/planetary-visions.png',
  esaLogo: 'assets/images/esa-logo.png',
  ubilabsWebsite: 'https://ubilabs.com',
  planetaryVisionsWebsite: 'http://planetaryvisions.com/',
  githubRepo: 'https://github.com/ubilabs/esa-climate-from-space',
  cciWebsite: 'https://climate.esa.int/',
  esaWebsite: 'https://www.esa.int/',
  legendImage: `${baseUrlTiles}/{id}/legend.png`,
  downloadUrls,
  localStorageLanguageKey: 'language',
  localStorageWelcomeScreenKey: 'welcomeScreenChecked',
  delay: 5000,
  feedbackUrl: 'https://climate.esa.int/en/helpdesk/',
  markdownAllowedElements: [
    'p',
    'h1',
    'h2',
    'h3',
    'a',
    'br',
    'b',
    'em',
    'img',
    'fig',
    'figcaption',
    'li',
    'ul',
    'ol'
  ]
};
