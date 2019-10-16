import {
  SET_GLOBE_PROJECTION,
  SetGlobeProjectionAction
} from '../../actions/set-globe-projection';
import {parseUrl} from '../../libs/globe-url-parameter';
import config from '../../config/main';

import {GlobeProjection} from '../../types/globe-projection';
import {State} from '../index';

// get initial state from url or fallback to default state in config
const globeState = parseUrl() || config.globe;
const initialState = globeState.projection;

function projectionReducer(
  state: GlobeProjection = initialState,
  action: SetGlobeProjectionAction
): GlobeProjection {
  switch (action.type) {
    case SET_GLOBE_PROJECTION:
      return action.projection;
    default:
      return state;
  }
}

export function projectionSelector(state: State): GlobeProjection {
  return state.globe.projection;
}

export default projectionReducer;
