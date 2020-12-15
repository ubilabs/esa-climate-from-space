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
      height: 27000000,
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
  landCoverLegendValues: [
    {value: 'No data', color: ' rgb(0, 0, 0)'},
    {value: 'Cropland, rainfed', color: 'rgb(255, 255, 100)'},
    {value: 'Herbaceous cover', color: 'rgb(255, 255, 100)'},
    {value: 'Tree or shrub cover', color: 'rgb(255, 255, 0)'},
    {
      value: 'Cropland, irrigated or post-flooding',
      color: 'rgb(170, 240, 240)'
    },
    {
      value:
        'Mosaic cropland (>50%) / natural vegetation (tree, shrub, herbaceous cover) (<50%)',
      color: 'rgb(220, 240, 100)'
    },
    {
      value:
        'Mosaic natural vegetation (tree, shrub, herbaceous cover) (>50%) / cropland (<50%)',
      color: 'rgb(200, 200, 100)'
    },
    {
      value: 'Tree cover, broadleaved, evergreen, closed to open (>15%)',
      color: 'rgb(0, 100, 0)'
    },
    {
      value: 'Tree cover, broadleaved, deciduous, closed to open (>15%)',
      color: 'rgb(0, 160, 0)'
    },
    {
      value: 'Tree cover, broadleaved, deciduous, closed (>40%)',
      color: 'rgb(0, 160, 0)'
    },
    {
      value: 'Tree cover, broadleaved, deciduous, open (15-40%)',
      color: 'rgb(170, 200, 0)'
    },
    {
      value: 'Tree cover, needleleaved, evergreen, closed to open (>15%)',
      color: 'rgb(0, 60, 0)'
    },
    {
      value: 'Tree cover, needleleaved, evergreen, closed (>40%)',
      color: 'rgb(0, 60, 0)'
    },
    {
      value: 'Tree cover, needleleaved, evergreen, open (15-40%)',
      color: 'rgb(0, 80, 0)'
    },
    {
      value: 'Tree cover, needleleaved, deciduous, closed to open (>15%)',
      color: 'rgb(40, 80, 0)'
    },
    {
      value: 'Tree cover, needleleaved, deciduous, closed (>40%)',
      color: 'rgb(40, 80, 0)'
    },
    {
      value: 'Tree cover, needleleaved, deciduous, open (15-40%)',
      color: 'rgb(40, 100, 0)'
    },
    {
      value: 'Tree cover, mixed leaf type (broadleaved and needleleaved)',
      color: 'rgb(120, 130, 0)'
    },
    {
      value: 'Mosaic tree and shrub (>50%) / herbaceous cover (<50%)',
      color: 'rgb(140, 160, 0)'
    },
    {
      value: 'Mosaic herbaceous cover (>50%) / tree and shrub (<50%)',
      color: 'rgb(190, 150, 0)'
    },
    {value: 'Shrubland', color: 'rgb(150, 100, 0)'},
    {value: 'Shrubland evergreen', color: 'rgb(120, 75, 0)'},
    {value: 'Shrubland deciduous', color: 'rgb(150, 100, 0)'},
    {value: 'Grassland', color: 'rgb(255, 180, 50)'},
    {value: 'Lichens and mosses', color: 'rgb(255, 220, 210)'},
    {
      value: 'Sparse vegetation (tree, shrub, herbaceous cover) (<15%)',
      color: 'rgb(255, 235, 175)'
    },
    {value: 'Sparse tree (<15%)', color: 'rgb(255, 200, 100)'},
    {value: 'Sparse shrub (<15%)', color: 'rgb(255, 210, 120)'},
    {value: 'Sparse herbaceous cover (<15%)', color: 'rgb(255, 235, 175)'},
    {
      value: 'Tree cover, flooded, fresh or brakish water',
      color: 'rgb(0, 120, 90)'
    },
    {value: 'Tree cover, flooded, saline water', color: 'gb(0, 150, 120)'},
    {
      value: 'Shrub or herbaceous cover, flooded, fresh/saline/brakish water',
      color: 'rgb(0, 220, 130)'
    },
    {value: 'Urban areas', color: 'rgb(195, 20, 0)'},
    {value: 'Bare areas', color: 'rgb(255, 245, 215)'},
    {value: 'Consolidated bare areas', color: 'rgb(220, 220, 220)'},
    {value: 'Unconsolidated bare areas', color: 'rgb(255, 245, 215)'},
    {value: 'Water bodies', color: 'rgb(0, 70, 200)'},
    {value: 'Permanent snow and ice', color: 'rgb(255, 255, 255)'}
  ]
};
