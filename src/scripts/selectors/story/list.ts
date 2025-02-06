import { State } from "../../reducers/index";

export function storyListSelector(state: State) {
  return state.stories.storiesList;
}
