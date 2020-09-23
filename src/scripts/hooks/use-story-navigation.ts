import {useStoryParams} from './use-story-params';

import {StoryMode} from '../types/story-mode';
import {SlideType} from '../types/slide-type';

/* eslint-disable complexity */
export const useStoryNavigation = () => {
  const {
    mode,
    storyIds,
    storyIndex,
    slideIndex,
    selectedStory
  } = useStoryParams();
  const numberOfSlides = selectedStory?.slides.length;

  let autoPlayLink = null;
  let nextSlideLink = null;
  let previousSlideLink = null;
  let delay = 3000;

  if (!numberOfSlides) {
    return {autoPlayLink, nextSlideLink, previousSlideLink};
  }

  const previousSlideIndex = slideIndex - 1;
  const nextSlideIndex = slideIndex + 1;

  if (mode !== StoryMode.Showcase) {
    if (previousSlideIndex >= 0) {
      previousSlideLink = `/${mode}/${storyIds}/${previousSlideIndex}`;
    }
    if (nextSlideIndex < numberOfSlides) {
      nextSlideLink = `/${mode}/${storyIds}/${nextSlideIndex}`;
    }
  }

  if (storyIds && typeof storyIndex === 'number') {
    const showcaseStoryIds = storyIds.join('&');
    const nextStoryIndex = storyIndex + 1;
    const currentSlide = selectedStory?.slides[slideIndex];
    // go through all slides of one story

    if (currentSlide?.images && currentSlide.type === SlideType.Image) {
      delay = delay * currentSlide.images.length;
    }
    if (slideIndex + 1 < numberOfSlides) {
      autoPlayLink = `/showcase/${showcaseStoryIds}/${storyIndex}/${nextSlideIndex}`;
      // when no slides are left, go to first slide of next story
    } else if (nextStoryIndex < storyIds.length) {
      autoPlayLink = `/showcase/${showcaseStoryIds}/${nextStoryIndex}/0`;
      // after the last story, return to the beginning
    } else {
      autoPlayLink = `/showcase/${showcaseStoryIds}/0/0`;
    }
  }

  return {autoPlayLink, nextSlideLink, previousSlideLink, delay};
};
