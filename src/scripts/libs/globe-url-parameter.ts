import { UrlHashState } from "../types/url-hash-state";

import { GlobeProjection } from "../types/globe-projection";
import { RenderMode } from "@ubilabs/esa-webgl-globe";
import { GlobeState } from "../reducers/globe/globe-state";

const SEPARATOR_CHAR = "I";
const PARAM_COUNT = 9;

type SerializedUrlParams = {
  projection: GlobeProjection;
  lng: number;
  lat: number;
  altitude: number;
  zoom: number;
  time: number;
  spinning: boolean;
  mainId: string | null;
  compareId: string | null;
};

// parses window.location and generates a globe state from query params
//
// note: we do not use the location.search prop here because the HashRouter
// stores the query parameters in the location.hash prop
export function parseUrl(): UrlHashState | null {
  // only take the query portion of the hash string
  const queryString = location.hash.slice(location.hash.indexOf("?"));
  const urlParams = new URLSearchParams(queryString);
  const globeParam = urlParams.get("globe");

  const params = globeParam && unserialize(globeParam);

  if (!params) {
    return null;
  }

  const {
    projection,
    lng,
    lat,
    altitude,
    zoom,
    time,
    spinning,
    mainId,
    compareId,
  } = params;

  const renderMode = (
    projection === GlobeProjection.Sphere ? "globe" : "map"
  ) as RenderMode;

  return {
    globeState: {
      view: { renderMode, lng, lat, altitude, zoom },
      projectionState: {
        projection,
        morphTime: 2,
      },
      layerLoadingState: {},
      time,
      spinning,
    },
    layerIds: {
      mainId,
      compareId,
    },
  };
}

export function getParamString(
  globeState: GlobeState,
  mainId: string | null,
  compareId: string | null,
): string | null {
  const { view, projectionState, time, spinning } = globeState;
  const { lat, lng, altitude, zoom } = view;
  // fixme: previously this returned null if any numeric value was NaN,
  //  is that actually an issue anywhere?
  return serialize({
    projection: projectionState.projection,
    lng,
    lat,
    altitude,
    zoom,
    time,
    spinning,
    mainId,
    compareId,
  });
}

function serialize(params: SerializedUrlParams): string | null {
  return [
    params.projection === GlobeProjection.Sphere ? "S" : "P",
    params.lng.toFixed(2) || "0",
    params.lat.toFixed(2) || "0",
    params.altitude.toFixed(0) || "0",
    params.zoom.toFixed(2) || "0",
    params.time || "0",
    params.spinning ? "1" : "0",
    params.mainId || "",
    params.compareId || "",
  ].join(SEPARATOR_CHAR);
}

function unserialize(paramsString: string): SerializedUrlParams | null {
  const parts = paramsString.split(SEPARATOR_CHAR);

  if (parts.length !== PARAM_COUNT) {
    return null;
  }

  return {
    projection:
      parts[0] === "S" ? GlobeProjection.Sphere : GlobeProjection.PlateCaree,
    lng: parseFloat(parts[1]) || 0,
    lat: parseFloat(parts[2]) || 0,
    altitude: parseFloat(parts[3]) || 0,
    zoom: parseFloat(parts[4]) || 0,
    time: parseFloat(parts[5]) || 0,
    spinning: parts[6] === "1",
    mainId: parts[7] || null,
    compareId: parts[8] || null,
  };
}
