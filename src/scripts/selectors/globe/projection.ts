import {State} from '../../reducers/index';

import {GlobeProjectionState} from '../../types/globe-projection-state';

export function projectionSelector(state: State): GlobeProjectionState {
  return state.globe.projectionState;
}
