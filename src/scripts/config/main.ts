import { RenderMode } from "@ubilabs/esa-webgl-globe";

import { UiEmbedElement } from "../types/embed-elements";

import { GlobeProjection } from "../types/globe-projection";
import { GlobeState } from "../reducers/globe/globe-state";
import { AppRoute } from "../types/app-routes";

/**
 * Routes are utilized to manage state transitions within the application.
 * The RouteMatch component is updating the state as it renders across all routes.
 * Legacy routes are also supported and maintained.
 * Extend or modify route patterns here as necessary to accommodate new requirements.
 * Be aware that the order here matters because this object is used to match route patterns
 */
export const ROUTES = {
  [AppRoute.LegacyStory]: {
    path: "stories/:storyId/:slideIndex",
    end: true,
  },
  [AppRoute.LegacyStories]: { path: "stories/", end: true },
  [AppRoute.About]: { path: "/about", end: true },
  [AppRoute.PresentStory]: {
    path: "/present/:storyId/:slideIndex",
    end: true,
  },
  [AppRoute.Present]: { path: "/present", end: true },
  [AppRoute.ShowcaseStory]: {
    path: "/showcase/:storyIds/:storyIndex/:slideIndex",
    end: true,
  },
  [AppRoute.ShowcaseStories]: { path: "/showcase/:storyIds", end: true },
  [AppRoute.Showcase]: { path: "/showcase", end: true },
  [AppRoute.Stories]: {
    path: "/:category/stories/:storyId/:slideIndex",
    end: true,
  },
  [AppRoute.Data]: { path: "/:category/data", end: true },
  [AppRoute.NavContent]: { path: "/:category", end: true },
  [AppRoute.Base]: { path: "/", end: true },
} as const;

// Constants for auto-rotation timing of the content navigation
// This is not related to the auto rotation of the globe

export const AUTO_ROTATE_INTERVAL = 5000; // Time between auto-rotations in milliseconds
export const USER_INACTIVITY_TIMEOUT = 30000; // Time to wait after user interaction before restarting auto-rotation

export const CONTENT_NAV_LONGITUDE_OFFSET = -55;

// The order of these is important for the stories menu
export const categoryTags = [
  "welcome",
  "land",
  "ocean",
  "atmosphere",
  "cryosphere",
  "water_cycle",
  "carbon_cycle",
  "climate_risk",
  "climate_action",
  "improving_models",
];

const globeState: GlobeState = {
  time: Date.now(),
  projectionState: {
    projection: GlobeProjection.Sphere,
    morphTime: 2,
  },
  view: {
    renderMode: "globe" as RenderMode,
    lat: 25,
    lng: 0,
    altitude: 23840000,
    zoom: 0,
    isAnimated: false,
  },
  spinning: true,
  layerLoadingState: {},
};

export const uiEmbedElements: UiEmbedElement[] = [
  {
    embedPath: "/",
    title: "app",
    elements: ["header", "logo", "app_menu", "back_link"],
  },
  {
    title: "layers",
    elements: ["time_slider", "legend", "layers_menu"],
    embedPath: "/data",
  },
];

// @ts-expect-error - injected via vite
const version = INFO_VERSION;
const baseUrlTiles = `https://storage.googleapis.com/esa-cfs-tiles/${version}`;
let baseUrlStorage = "/";

// use content from local server
if (import.meta.env.PROD) {
  baseUrlStorage = `https://storage.googleapis.com/esa-cfs-storage/${version}/`;
}

type BasemapId =
  | "atmosphere"
  | "blue"
  | "colored"
  | "dark"
  | "land"
  | "ocean"
  | "clouds";

const basemapMaxZoom: { [id in BasemapId]: number } = {
  atmosphere: 4,
  blue: 4,
  colored: 5,
  dark: 4,
  land: 4,
  ocean: 4,
  clouds: 4,
} as const;

const basemapUrls: { [id in BasemapId]: string } = {
  land: `${baseUrlTiles}/basemaps/land`,
  ocean: `${baseUrlTiles}/basemaps/ocean`,
  atmosphere: `${baseUrlTiles}/basemaps/atmosphere`,
  blue: `${baseUrlTiles}/basemaps/blue`,
  dark: `${baseUrlTiles}/basemaps/dark`,
  colored: `${baseUrlTiles}/basemaps/colored`,
  clouds: `${baseUrlTiles}/basemaps/clouds`,
} as const;

const basemapUrlsOffline: { [id in BasemapId]: string } = {
  land: "basemaps/land",
  ocean: "basemaps/ocean",
  atmosphere: "basemaps/atmosphere",
  blue: "basemaps/blue",
  dark: "basemaps/dark",
  colored: "basemaps/colored",
  clouds: "basemaps/clouds",
} as const;

const downloadUrls = {
  windows: `https://storage.googleapis.com/esa-cfs-versions/electron/${version}/esa-climate-from-space-${version}-win.exe`,
  macOS: `https://storage.googleapis.com/esa-cfs-versions/electron/${version}/esa-climate-from-space-${version}-mac.zip`,
  linux: `https://storage.googleapis.com/esa-cfs-versions/electron/${version}/esa-climate-from-space-${version}-linux.zip`,
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
    story: `${baseUrlStorage}stories/{id}/{id}-{lang}.json`,
  },
  defaultBasemap: "colored" as BasemapId,
  defaultLayerBasemap: "land" as BasemapId,
  basemapUrls,
  basemapUrlsOffline,
  basemapMaxZoom,
  globe: globeState,
  share: {
    facebook:
      "https://www.facebook.com/sharer/sharer.php?u={currentUrl}&text=ESAClimateFromSpace",
    twitter:
      "http://twitter.com/intent/tweet?text=ESA%20Climate%20From%20Space&url={currentUrl}",
  },

  ubilabsWebsite: "https://ubilabs.com",
  planetaryVisionsWebsite: "http://planetaryvisions.com/",
  githubRepo: "https://github.com/ubilabs/esa-climate-from-space",
  cciWebsite: "https://climate.esa.int/",
  esaWebsite: "https://www.esa.int/",
  legendImage: `${baseUrlTiles}/{id}/legend.png`,
  downloadUrls,
  localStorageLanguageKey: "language",
  localStorageHasUserInteractedKey: "hasUserInteracted",
  localStorageWelcomeScreenKey: "welcomeScreenChecked",
  delay: 5000,
  feedbackUrl: "https://climate.esa.int/en/helpdesk/",
  markdownAllowedElements: [
    "p",
    "h1",
    "h2",
    "h3",
    "a",
    "br",
    "b",
    "em",
    "img",
    "fig",
    "figcaption",
    "li",
    "ul",
    "ol",
    "strong",
  ],
};
