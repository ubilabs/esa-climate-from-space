import { GlobeProjection } from "../types/globe-projection";

export const SET_GLOBE_PROJECTION = "SET_GLOBE_PROJECTION";

export interface SetGlobeProjectionAction {
  type: typeof SET_GLOBE_PROJECTION;
  projection: GlobeProjection;
  morphTime: number;
}

const setGlobeProjectionAction = (
  projection: GlobeProjection,
  morphTime: number,
): SetGlobeProjectionAction => ({
  type: SET_GLOBE_PROJECTION,
  projection,
  morphTime,
});

export default setGlobeProjectionAction;
