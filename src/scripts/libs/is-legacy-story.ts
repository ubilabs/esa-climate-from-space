import { LegacyStory } from "../types/legacy-story";
import { Story } from "../types/story";

/**
 * Checks if a given story is a legacy story.
 * Background: Currently, we have stories that adhere to the "legacy" structure of a story
 * as well as stories with the updated structure to support mixed content
 * @param story - The story to check.
 * @returns True if the story is a legacy story, false otherwise.
 *
 */
export const isLegacyStory = (story: LegacyStory | Story): boolean => {
  // If a story slide contains the property "galleryItems", we infer that is a new story
  // Otherwise, it is a legacy story
  for (const slide of story.slides) {
    if ("galleryItems" in slide) {
      return false;
    }
  }

  return true;
};
