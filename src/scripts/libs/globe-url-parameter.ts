import {GlobeState} from '../reducers/globe/index';
import {GlobeProjection} from '../types/globe-projection';

const char = 'l';

// parses window.location and generates a globe state from query params
//
// note: we do not use the location.search prop here because the HashRouter
// stores the query parameters in the location.hash prop
export function parseUrl(): GlobeState | null {
  const {hash} = location;
  // only take the query portion of the hash string
  const queryString = hash.substr(hash.indexOf('?'));
  const urlParams = new URLSearchParams(queryString);
  const globeParam = urlParams.get('globe');

  if (!globeParam) {
    return null;
  }

  const splitted = globeParam.split(char);

  if (splitted.length !== 8) {
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
  const values = splitted.slice(1).map(str => parseFloat(str));

  if (values.some(num => isNaN(num))) {
    return null;
  }

  return {
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
    time: values[6]
  };
}

export function getParamString(globeState: GlobeState): string | null {
  const {view, projectionState, time} = globeState;
  const {position, orientation} = view;
  const {longitude, latitude, height} = position;
  const {heading, pitch, roll} = orientation;
  const values = [longitude, latitude, height, heading, pitch, roll, time];

  if (values.some(num => isNaN(num))) {
    return null;
  }

  const compactValues = values.map(num => num.toFixed(2));

  return [projectionState.projection[0], ...compactValues].join(char);
}
