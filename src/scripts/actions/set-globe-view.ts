import {GlobeView} from '../types/globe-view';

export const SET_GLOBE_VIEW = 'SET_GLOBE_VIEW';

export interface SetGlobeViewAction {
  type: typeof SET_GLOBE_VIEW;
  view: GlobeView;
}

const setGlobeViewAction = (view: GlobeView): SetGlobeViewAction => ({
  type: SET_GLOBE_VIEW,
  view
});

export default setGlobeViewAction;
