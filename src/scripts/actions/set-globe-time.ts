export const SET_GLOBE_TIME = 'SET_GLOBE_TIME';

export interface SetGlobeTimeAction {
  type: typeof SET_GLOBE_TIME;
  time: number;
}

const setGlobeTimeAction = (time: number): SetGlobeTimeAction => ({
  type: SET_GLOBE_TIME,
  time
});

export default setGlobeTimeAction;
