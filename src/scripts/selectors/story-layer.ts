import { State } from "../reducers/index";

export function storyLayerSelector(state: State): string | null {
  return state.storyLayerId.storyLayerId;
}
