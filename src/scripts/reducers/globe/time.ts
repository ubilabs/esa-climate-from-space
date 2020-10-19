import {SET_GLOBE_TIME, SetGlobeTimeAction} from '../../actions/set-globe-time';
import {parseUrl} from '../../libs/globe-url-parameter';
import config from '../../config/main';

// get initial state from url or fallback to default state in config
const globeState = parseUrl()?.globeState || config.globe;
const initialState = globeState.time;

function timeReducer(
  state: number = initialState,
  action: SetGlobeTimeAction
): number {
  switch (action.type) {
    case SET_GLOBE_TIME:
      return action.time;
    default:
      return state;
  }
}

export default timeReducer;
