import { CameraView } from "@ubilabs/esa-webgl-globe";

export const SET_GLOBE_VIEW = "SET_GLOBE_VIEW";

export interface SetGlobeViewAction {
  type: typeof SET_GLOBE_VIEW;
  view: CameraView;
}

const setGlobeViewAction = (view: CameraView): SetGlobeViewAction => ({
  type: SET_GLOBE_VIEW,
  view,
});

export default setGlobeViewAction;
