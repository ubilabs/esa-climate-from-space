import {GlobeView} from '../types/globe-view';

export const SET_FLY_TO = 'SET_FLY_TO';

export interface SetFlyToAction {
  type: typeof SET_FLY_TO;
  view: GlobeView;
}

const setFlyToAction = (view: GlobeView): SetFlyToAction => ({
  type: SET_FLY_TO,
  view
});

export default setFlyToAction;
