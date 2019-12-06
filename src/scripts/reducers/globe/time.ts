import {SET_GLOBE_TIME, SetGlobeTimeAction} from '../../actions/set-globe-time';
import config from '../../config/main';

const initialState = config.globe.time;

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
