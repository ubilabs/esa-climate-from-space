import {GlobeState} from '../reducers/globe/index';
import {GlobeProjection} from '../actions/set-globe-projection';

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

  if (splitted.length !== 7) {
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
      orientation: {
        heading: values[0],
        pitch: values[1],
        roll: values[2]
      },
      destination: [values[3], values[4], values[5]]
    },
    projection
  };
}

export function getParamString(globeState: GlobeState): string {
  const {view, projection} = globeState;
  const {orientation, destination} = view;
  const {heading, pitch, roll} = orientation;

  const orientationString = [heading, pitch, roll]
    .map(num => num.toFixed(2))
    .join(char);
  const destinationString = destination.map(num => Math.round(num)).join(char);

  return [projection[0], orientationString, destinationString].join(char);
}
