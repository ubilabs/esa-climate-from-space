import {State} from '../../reducers/index';

export function selectedTagsSelector(state: State) {
  return state.stories.selectedTags;
}
