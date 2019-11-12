import {State} from '../../reducers/index';
import {StoriesState} from '../../reducers/story/index';

export const StoriesStateSelector = (state: State): StoriesState =>
  state.stories;
