import {SET_GLOBE_VIEW, SetGlobeViewAction} from '../../actions/set-globe-view';
import {parseUrl} from '../../libs/globe-url-parameter';
import config from '../../config/main';

import {GlobeView} from '../../types/globe-view';

// get initial state from url or fallback to default state in config
const globeState = parseUrl()?.globeState || config.globe;
const initialState = globeState.view;

function globeViewReducer(
  state: GlobeView = initialState,
  action: SetGlobeViewAction
): GlobeView {
  switch (action.type) {
    case SET_GLOBE_VIEW:
      return action.view;
    default:
      return state;
  }
}

export default globeViewReducer;
