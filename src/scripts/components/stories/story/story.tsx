import { FunctionComponent, useCallback } from "react";

import { useStoryAutoScroll } from "../../../hooks/use-story-auto-scroll";
import { useUpdateControllerOnRouteChange } from "../../../providers/parallax/use-parallax-config";
import { useStory } from "../../../providers/story/use-story";

import { SplashScreen } from "./blocks/splashscreen/splashscreen";

import cx from "classnames";

import styles from "./story.module.css";
import {
  getBlockComponent,
  getFormatComponent,
} from "../../../libs/get-story-components";

/**
 * Story Component
 *
 * A story is divided into content blocks, each containing various formats. (Story -> Block -> Format)
 * This component dynamically renders the main story page, including content blocks and their respective formats.
 * It handles auto-scrolling behavior on initial render
 * and sets the story element as a callback ref for DOM manipulation.
 *
 * Notes:
 * - Ensure there are no duplicate slide indices in the story.
 * - Missing components for content blocks or block formats will log warnings to the console.
 */
const Story: FunctionComponent = () => {
  const { setStoryElement, story } = useStory();

  // Custom hook to handle auto-scrolling behavior on intial render
  useStoryAutoScroll();

  // Update parallax controller on route change
  useUpdateControllerOnRouteChange();

  // A callback Ref ensures setStoryElement is called the moment the DOM node is available. We are using similar approach in globe.tsx
  const callbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        setStoryElement(node);
      }
    },
    [setStoryElement],
  );

  if (!story) {
    return null;
  }

  return (
    <main
      className={cx(styles.story, styles.fadeIn)}
      ref={callbackRef}
      id="story"
    >
      <>
        {/*  Slide index is used to determine which slide is currently active */}
        <SplashScreen slideIndex={0} />
        {story.content.map((contentBlock, idx) => {
          const BlockComponent = getBlockComponent(contentBlock.type);

          return (
            <BlockComponent key={idx}>
              {/* we do not need to pass any story props because they are provided by the useStory context  */}
              {contentBlock.blocks.map(({ type }, i) => {
                const FormatComponent = getFormatComponent(type);
                return <FormatComponent key={i} slideIndex={i + 1} />;
              })}
            </BlockComponent>
          );
        })}
      </>
    </main>
  );
};

export default Story;
