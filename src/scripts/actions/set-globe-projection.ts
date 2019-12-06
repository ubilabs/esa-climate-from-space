import {GlobeProjection} from '../types/globe-projection';

export const SET_GLOBE_PROJECTION = 'SET_GLOBE_PROJECTION';

export interface SetGlobeProjectionAction {
  type: typeof SET_GLOBE_PROJECTION;
  projection: GlobeProjection;
}

const setGlobeProjectionAction = (
  projection: GlobeProjection
): SetGlobeProjectionAction => ({
  type: SET_GLOBE_PROJECTION,
  projection
});

export default setGlobeProjectionAction;
