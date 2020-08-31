import {GlobeState} from '../reducers/globe/index';
import {UrlHashState} from '../types/url-hash-state';

import {GlobeProjection} from '../types/globe-projection';

const char = 'I';

// parses window.location and generates a globe state from query params
//
// note: we do not use the location.search prop here because the HashRouter
// stores the query parameters in the location.hash prop
export function parseUrl(): UrlHashState | null {
  const {hash} = location;
  // only take the query portion of the hash string
  const queryString = hash.substr(hash.indexOf('?'));
  const urlParams = new URLSearchParams(queryString);
  const globeParam = urlParams.get('globe');

  if (!globeParam) {
    return null;
  }

  const splitted = globeParam.split(char);

  if (splitted.length !== 11) {
    return null;
  }

  // projection
  const projectionChar = splitted[0];
  const projection = Object.values(GlobeProjection).find(proj =>
    proj.startsWith(projectionChar)
  );

  if (!projection) {
    return null;
  }

  // globe view values
  const values = splitted.slice(1, 9).map(str => parseFloat(str));

  if (values.some(num => isNaN(num))) {
    return null;
  }

  // selected main and compare layer ids
  const layerIds = splitted.slice(9, 11).map(id => id || null);

  return {
    globeState: {
      view: {
        position: {
          longitude: values[0],
          latitude: values[1],
          height: values[2]
        },
        orientation: {
          heading: values[3],
          pitch: values[4],
          roll: values[5]
        }
      },
      projectionState: {
        projection: GlobeProjection.Sphere,
        morphTime: 2
      },
      time: values[6],
      spinning: Boolean(Number(values[7]))
    },
    layerIds: {
      mainId: layerIds[0],
      compareId: layerIds[1]
    }
  };
}

export function getParamString(
  globeState: GlobeState,
  mainId: string | null,
  compareId: string | null
): string | null {
  const {view, projectionState, time, spinning} = globeState;
  const {position, orientation} = view;
  const {longitude, latitude, height} = position;
  const {heading, pitch, roll} = orientation;
  const values = [
    longitude,
    latitude,
    height,
    heading,
    pitch,
    roll,
    time,
    spinning ? 1 : 0
  ];

  if (values.some(num => isNaN(num))) {
    return null;
  }

  const compactValues = values.map(num => num.toFixed(2));

  return [
    projectionState.projection[0],
    ...compactValues,
    mainId,
    compareId
  ].join(char);
}
