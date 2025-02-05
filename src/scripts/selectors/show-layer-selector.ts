import { State } from "../reducers/index";

export function showLayerSelector(state: State): boolean {
  return state.showLayerSelector;
}
