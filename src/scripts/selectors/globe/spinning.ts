import {State} from '../../reducers/index';

export function globeSpinningSelector(state: State): boolean {
  return state.globe.spinning;
}
