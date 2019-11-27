import {StoryMode} from '../types/story-mode';

interface Params {
  mode: StoryMode;
  slideIndex: number;
  storyIndex: number;
  storyId?: string | null;
  storyIds?: string;
  numberOfSlides?: number;
}
// eslint-disable-next-line
export const getNavigationData = ({
  mode,
  slideIndex,
  storyIndex,
  storyId,
  storyIds,
  numberOfSlides
}: Params) => {
  let autoPlayLink = null;
  let nextSlideLink = null;
  let previousSlideLink = null;

  if (!numberOfSlides) {
    return {autoPlayLink, nextSlideLink, previousSlideLink};
  }

  const previousSlideIndex = slideIndex - 1;
  if (previousSlideIndex >= 0) {
    previousSlideLink = `/${mode}/${storyId}/${previousSlideIndex}`;
  }
  const nextSlideIndex = slideIndex + 1;
  if (nextSlideIndex < numberOfSlides) {
    nextSlideLink = `/${mode}/${storyId}/${nextSlideIndex}`;
  }

  if (storyIds) {
    const stories = storyIds.split('&');
    const nextStoryIndex = storyIndex + 1;

    if (slideIndex + 1 < numberOfSlides) {
      autoPlayLink = `/showcase/${storyIds}/${storyIndex}/${nextSlideIndex}`;
    } else if (nextStoryIndex < stories.length) {
      autoPlayLink = `/showcase/${storyIds}/${nextStoryIndex}/0`;
    } else {
      autoPlayLink = `/showcase/${storyIds}/0/0`;
    }
  }

  return {autoPlayLink, nextSlideLink, previousSlideLink};
};
