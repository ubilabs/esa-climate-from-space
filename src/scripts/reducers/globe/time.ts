import {SET_GLOBE_TIME, SetGlobeTimeAction} from '../../actions/set-globe-time';
import config from '../../config/main';

import {State} from '../index';

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

export function timeSelector(state: State): number {
  return state.globe.time;
}

export default timeReducer;
