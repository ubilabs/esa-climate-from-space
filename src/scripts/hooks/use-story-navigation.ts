import { useContentParams } from "./use-content-params";
import config from "../config/main";

import { StoryMode } from "../types/story-mode";
import { GalleryItemType } from "../types/gallery-item";

export const useStoryNavigation = (videoDuration: number) => {
  const { mode, storyIds, storyIndex, slideIndex, selectedStory } =
    useContentParams();

  const numberOfSlides = selectedStory?.slides.length;

  let autoPlayLink = null;
  let nextSlideLink = null;
  let previousSlideLink = null;
  let delay = config.delay;

  if (!numberOfSlides) {
    return { autoPlayLink, nextSlideLink, previousSlideLink };
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

  if (storyIds && typeof storyIndex === "number") {
    const showcaseStoryIds = storyIds.join("&");
    const nextStoryIndex = storyIndex + 1;
    const currentSlide = selectedStory?.slides[slideIndex];
    // go through all slides of one story

    if (currentSlide?.galleryItems.length) {
      delay = currentSlide.galleryItems?.reduce((totalDelay, item) => {
        if (
          item.type === GalleryItemType.Video &&
          (item?.videoId || item?.videoSrc)
        ) {
          return totalDelay + config.delay + videoDuration;
        }
        return totalDelay + config.delay;
      }, 0);
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

  return { autoPlayLink, nextSlideLink, previousSlideLink, delay };
};
