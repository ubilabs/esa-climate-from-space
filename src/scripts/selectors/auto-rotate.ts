import { State } from "../reducers/index";

export function isAutoRotatingSelector(state: State): boolean {
  return state.globe.isAutoRotationEnabled
}
