import { State } from "../../reducers/index";

export function multiGlobeSyncEnabledSelector(state: State): boolean {
  return state.globe.multiGlobeSync;
}
