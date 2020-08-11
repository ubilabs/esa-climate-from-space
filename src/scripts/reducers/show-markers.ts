import {SHOW_MARKERS, ShowMarkersAction} from '../actions/show-markers';

const initialState = false;

function showMarkersReducer(
  state: boolean = initialState,
  action: ShowMarkersAction
): boolean {
  switch (action.type) {
    case SHOW_MARKERS:
      return action.showMarkers;
    default:
      return state;
  }
}

export default showMarkersReducer;
