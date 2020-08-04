import {State} from '../reducers/index';

export function showMarkersSelector(state: State): boolean {
  return state.showMarkers;
}
