import {State} from '../../reducers/index';

import {GlobeProjection} from '../../types/globe-projection';

export function projectionSelector(state: State): GlobeProjection {
  return state.globe.projection;
}
