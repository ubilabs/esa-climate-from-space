export const SET_PROJECTION = 'SET_PROJECTION';

export enum Projection {
  Sphere = 'Sphere',
  Mercator = 'Mercator',
  PlateCaree = 'PlateCaree'
}

export interface SetProjectionAction {
  type: typeof SET_PROJECTION;
  projection: Projection;
}

export const setProjectionAction = (
  projection: Projection
): SetProjectionAction => ({
  type: SET_PROJECTION,
  projection
});
