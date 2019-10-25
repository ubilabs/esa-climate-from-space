import {SET_FLY_TO, SetFlyToAction} from '../actions/set-fly-to';

import {State} from './index';
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

export function flyToSelector(state: State): GlobeView | null {
  return state.flyTo;
}

export default flyToReducer;
