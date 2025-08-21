import { LegacyStory } from "../types/legacy-story";
import { Story } from "../types/story";

/**
 * Checks if a given story is a legacy story. Legacy stories are pagination-based stories
 */
export const isLegacyStory = (story: LegacyStory | Story): boolean => {
  // if a story has the new 'content' property, it is not a legacy story
  if ("blocks" in story) {
    return false;
  }

  return true;
};
