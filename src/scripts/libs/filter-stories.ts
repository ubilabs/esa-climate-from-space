import intersection from 'lodash.intersection';

import {StoryList} from '../types/story-list';

// filter stories by tags - keep story if at lease one of the tag matches
export function filterStories(stories: StoryList, tags: string[]) {
  if (tags.length === 0) {
    return stories;
  }

  return stories.filter(story => intersection(story.tags, tags).length > 0);
}
