import { useScroll, UseScrollOptions } from "motion/react";
import { useStory } from "../providers/story/use-story";

/**
 * Custom wrapper to manage scroll behavior for a story.
 * Returns scroll values relative to the story element (not the viewport)
 * We should always use this hook to get scroll values for story elements.
 * Can only be used within a StoryProvider context.
 *
 * @param {RefObject<HTMLElement>} [target] - Optional target element to observe scroll events.
 * @param {UseScrollOptions} [options] - Optional scroll options to customize behavior.
 * @returns {object} - Scroll values managed by the `useScroll` hook.
 */

type CustomUseScrollOptions = Omit<UseScrollOptions, "container">;

export function useStoryScroll({ target, ...options }: CustomUseScrollOptions) {
  const { storyElementRef } = useStory();

  const scrollValues = useScroll({
    container: storyElementRef,
    target,
    ...options,
  });

  return scrollValues;
}
