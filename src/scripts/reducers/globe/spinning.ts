import {
  SET_GLOBE_SPINNING,
  SetGlobeSpinningAction
} from '../../actions/set-globe-spinning';
import {
  SET_GLOBE_PROJECTION,
  SetGlobeProjectionAction
} from '../../actions/set-globe-projection';
import {SET_FLY_TO, SetFlyToAction} from '../../actions/set-fly-to';

import {GlobeProjection} from '../../types/globe-projection';
import config from '../../config/main';
import {parseUrl} from '../../libs/globe-url-parameter';

// get initial state from url or fallback to default state in config
const globeState = parseUrl()?.globeState || config.globe;
const initialState = globeState.spinning;

function spinningReducer(
  state: boolean = initialState,
  action: SetGlobeSpinningAction | SetGlobeProjectionAction | SetFlyToAction
): boolean {
  switch (action.type) {
    case SET_GLOBE_SPINNING:
      return action.spinning;
    case SET_GLOBE_PROJECTION:
      return action.projection === GlobeProjection.Sphere;
    case SET_FLY_TO:
      return false;
    default:
      return state;
  }
}

export default spinningReducer;
