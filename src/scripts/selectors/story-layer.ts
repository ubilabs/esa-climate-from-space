import {State} from '../reducers/index';

import {StoryLayer} from '../types/story-layer';

export function storyLayerSelector(state: State): StoryLayer | null {
  return state.storyLayer;
}
