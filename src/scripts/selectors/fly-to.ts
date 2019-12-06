import {State} from '../reducers/index';

import {GlobeView} from '../types/globe-view';

export function flyToSelector(state: State): GlobeView | null {
  return state.flyTo;
}
