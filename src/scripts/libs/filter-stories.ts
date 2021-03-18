import {StoryList} from '../types/story-list';

// filter stories by tags - keep story if all selected tags match
export function filterStories(stories: StoryList, tags: string[]) {
  if (tags.length === 0) {
    return stories;
  }

  return stories.filter(story => tags.every(tag => story.tags.includes(tag)));
}
