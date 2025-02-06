import { SET_FLY_TO, SetFlyToAction } from "../actions/set-fly-to";

import { CameraView } from "@ubilabs/esa-webgl-globe";

const initialState = null;

function flyToReducer(
  state: CameraView | null = initialState,
  action: SetFlyToAction,
): CameraView | null {
  switch (action.type) {
    case SET_FLY_TO:
      return action.view;
    default:
      return state;
  }
}

export default flyToReducer;
