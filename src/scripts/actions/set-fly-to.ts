import {CameraView} from '@ubilabs/esa-webgl-globe';

export const SET_FLY_TO = 'SET_FLY_TO';

export interface SetFlyToAction {
  type: typeof SET_FLY_TO;
  view: CameraView | null;
}

const setFlyToAction = (view: CameraView | null): SetFlyToAction => ({
  type: SET_FLY_TO,
  view
});

export default setFlyToAction;
