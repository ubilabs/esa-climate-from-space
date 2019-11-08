import {State} from '../../reducers/index';

export function timeSelector(state: State): number {
  return state.globe.time;
}
