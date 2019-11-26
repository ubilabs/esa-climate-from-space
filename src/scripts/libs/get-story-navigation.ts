import {Slide} from '../types/story';
import {StoryMode} from '../types/story-mode';

interface Params {
  pathname: string;
  pageNumber: number;
  slides?: Slide[];
}

export const getStoryNavigation = (
  pathname: string,
  mode: StoryMode,
  currentStory: number,
  storyIds?: string
) => {
  if (mode === StoryMode.Showcase) {
    if (!storyIds) {
      return null;
    }
    const stories = storyIds.split('&');
    const nextStoryNumber = currentStory + 1;
    const showNextStory = currentStory < stories.length;
    const nextStoryPath = `/showcase/${storyIds}/${nextStoryNumber}/0`;
    const initialPath = `/showcase/${storyIds}/0/0`;

    return {nextStoryPath, showNextStory, initialPath};
  }
  return null;
};
