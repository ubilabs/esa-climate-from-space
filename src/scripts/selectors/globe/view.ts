import {State} from '../../reducers/index';

import {GlobeView} from '../../types/globe-view';

export function globeViewSelector(state: State): GlobeView {
  return state.globe.view;
}
