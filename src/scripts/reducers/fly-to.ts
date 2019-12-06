import {SET_FLY_TO, SetFlyToAction} from '../actions/set-fly-to';

import {GlobeView} from '../types/globe-view';

const initialState = null;

function flyToReducer(
  state: GlobeView | null = initialState,
  action: SetFlyToAction
): GlobeView | null {
  switch (action.type) {
    case SET_FLY_TO:
      return action.view;
    default:
      return state;
  }
}

export default flyToReducer;
