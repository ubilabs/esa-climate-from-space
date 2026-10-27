import { LegacyStory } from "../types/legacy-story";
import { Story } from "../types/story";

/**
 * Checks if a given story is a legacy story. Legacy stories are pagination-based stories
 */
export const isLegacyStory = (story: LegacyStory | Story): boolean => {
  // if a story has the new 'modules' property, it is not a legacy story
  if ("modules" in story) {
    return false;
  }

  return true;
};

/**
 * Checks if a given legacy story contains mixed content, such as image and embedded gallery items.
 * @param story The story to check.
 * @returns True if the story is a mixed content legacy story, false otherwise.
 */
export const isMixedContentLegacyStory = (story: LegacyStory): boolean => {
  return story.slides.some((slide) => "galleryItems" in slide);
};
