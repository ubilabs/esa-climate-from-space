import {
  SET_GLOBE_PROJECTION,
  SetGlobeProjectionAction
} from '../../actions/set-globe-projection';
import {parseUrl} from '../../libs/globe-url-parameter';
import config from '../../config/main';

import {GlobeProjectionState} from '../../types/globe-projection-state';

// get initial state from url or fallback to default state in config
const globeState = parseUrl()?.globeState || config.globe;
const initialState = {
  projection: globeState.projectionState.projection,
  morphTime: 2
};

function projectionReducer(
  state: GlobeProjectionState = initialState,
  action: SetGlobeProjectionAction
): GlobeProjectionState {
  switch (action.type) {
    case SET_GLOBE_PROJECTION:
      return {projection: action.projection, morphTime: action.morphTime};
    default:
      return state;
  }
}

export default projectionReducer;
