export const SET_GLOBE_SPINNING = "SET_GLOBE_SPINNING";

export interface SetGlobeSpinningAction {
  type: typeof SET_GLOBE_SPINNING;
  spinning: boolean;
}

const setGlobeSpinningAction = (spinning: boolean): SetGlobeSpinningAction => ({
  type: SET_GLOBE_SPINNING,
  spinning,
});

export default setGlobeSpinningAction;
