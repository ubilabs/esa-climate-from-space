import {State} from '../../reducers/index';

import {Story} from '../../types/story';

export function unsafeSelectedStorySelector(state: State): Story | null {
  return state.stories.selected;
}

export function selectedStorySelector(
  state: State,
  storyId: string | null
): Story | null {
  if (!state.stories.selected || !storyId) {
    return null;
  }

  return state.stories.selected.id === storyId ? state.stories.selected : null;
}
