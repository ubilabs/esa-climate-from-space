import { FunctionComponent, memo, useCallback, useEffect } from "react";

import { useStoryAutoScroll } from "../../../hooks/use-story-auto-scroll";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdateControllerOnRouteChange } from "../../../providers/parallax/use-parallax-config";
import { useStory } from "../../../providers/story/use-story";

import { getUpdatedStoryUrl } from "../../../libs/get-updated-story-url";

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
 * It handles auto-scrolling behavior on initial render, updates the URL when the story slide index changes,
 * and sets the story element as a callback ref for DOM manipulation.
 *
 * Notes:
 * - Ensure there are no duplicate slide indices in the story.
 * - Missing components for content blocks or block formats will log warnings to the console.
 */
const Story: FunctionComponent = () => {
  const { setStoryElement, story, storySlideIndex, storyElement } = useStory();

  // const navigate = useNavigate();
  // const location = useLocation();

  // Custom hook to handle auto-scrolling behavior on intial render
  const { isInitialScroll } = useStoryAutoScroll(storyElement);

  // Update parallax controller on route change
  useUpdateControllerOnRouteChange();

  // Sync URL when index changes
  // useEffect(() => {
  //   // Prevent URL update on initial scroll
  //   // If we do not check for isInitialScroll, the URL will be updated on initial auto-scroll
  //   // This would effectively stop the auto-scroll
  //   if (isInitialScroll) return;
  //
  //   const newUrl = getUpdatedStoryUrl(location.pathname, storySlideIndex.current);
  //
  //   navigate(newUrl);
  // }, [storySlideIndex, navigate, isInitialScroll, location.pathname]);

  // A callback Ref ensures setStoryElement is called the moment the DOM node is available. We are using similar approach in globe.tsx
  const callbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        setStoryElement(node);
      }
    },
    [setStoryElement],
  );

  console.log("story");
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

export default memo(Story);
