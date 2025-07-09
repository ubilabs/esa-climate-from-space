import { FunctionComponent, ReactNode, useCallback, useEffect } from "react";

import {
  ImageGallery,
  ImageGalleryCompoundComponents,
} from "./blocks/image-gallery/image-gallery";

import { useStoryAutoScroll } from "../../../hooks/use-story-auto-scroll";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdateControllerOnRouteChange } from "../../../providers/parallax/use-parallax-config";
import { useStory } from "../../../providers/story/use-story";

import { getUpdatedStoryUrl } from "../../../libs/get-updated-story-url";

import {
  ImageGalleryBlock,
  imageGalleryFormatMap,
  StorySectionProps,
} from "../../../types/story";
import { SplashScreen } from "./blocks/splashscreen/splashscreen";

import cx from "classnames";

import styles from "./story.module.css";

/**
 * Story Component
 *
 * A story is divided into content blocks, each containing various formats. (Story -> Content Block -> Format)
 * This component dynamically renders the main story page, including content blocks and their respective formats.
 * It handles auto-scrolling behavior on initial render, updates the URL when the story slide index changes,
 * and sets the story element as a callback ref for DOM manipulation.
 *
 * Hooks:
 * - `useStory`: Provides the story data and methods to manage the story state.
 * - `useNavigate`: Enables navigation between routes.
 * - `useLocation`: Retrieves the current location object.
 * - `useStoryAutoScroll`: Custom hook to handle auto-scrolling behavior on initial render.
 * - `useUpdateControllerOnRouteChange`: Updates the parallax controller on route changes.
 *
 * Notes:
 * - Ensure there are no duplicate slide indices in the story.
 * - Missing components for content blocks or block formats will log warnings to the console.
 */
const Story: FunctionComponent = () => {
  const { setStoryElement, story, storySlideIndex, storyElement } = useStory();

  const navigate = useNavigate();
  const location = useLocation();

  // Custom hook to handle auto-scrolling behavior on intial render
  const { isInitialScroll } = useStoryAutoScroll(storyElement);

  // Update parallax controller on route change
  useUpdateControllerOnRouteChange();

  // Sync URL when index changes
  useEffect(() => {
    // Prevent URL update on initial scroll
    // If we do not check for isInitialScroll, the URL will be updated on initial auto-scroll
    // This would effectively stop the auto-scroll
    if (isInitialScroll) return;

    const newUrl = getUpdatedStoryUrl(location.pathname, storySlideIndex);

    navigate(newUrl);
  }, [storySlideIndex, navigate, isInitialScroll, location.pathname]);

  // A callback Ref ensures setStoryElement is called the moment the DOM node is available. We are using similar approach in globe.tsx
  const callbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        setStoryElement(node);
      }
    },
    [setStoryElement],
  );

  // Map of content block types to their respective components
  // Add missing components here as needed
  const contentBlockMap:
    | Record<
        string,
        FunctionComponent<{ children: ReactNode }> &
          ImageGalleryCompoundComponents
      >
    | undefined = {
    imageGallery: ImageGallery,
  };

  // Map of block types to their respective format components
  // Add missing format components here as needed
  const formatMap: Record<
    ImageGalleryBlock["type"],
    FunctionComponent<StorySectionProps>
  > = {
    ...imageGalleryFormatMap,
  };

  return (
    <main
      className={cx(styles.story, styles.fadeIn)}
      ref={callbackRef}
      id="story"
    >
      {story && (
        <>
          {/*  Slide index is used to determine which slide is currently active */}
          {/*  Make sure there is no duplicate slide index in the story */}
          <SplashScreen slideIndex={0} />
          {story.content.map((contentBlock, idx) => {
            const BlockComponent = contentBlockMap[contentBlock.type];

            if (!BlockComponent) {
              console.warn(
                `No component found for content block type: ${contentBlock.type}`,
              );
              return null;
            }

            return (
              <BlockComponent key={idx}>
                {contentBlock.blocks.map((block, i) => {
                  const FormatComponent = formatMap[block.type];

                  if (!FormatComponent) {
                    console.warn(
                      `No format component found for block type: ${block.type}`,
                    );
                    return null;
                  }

                  return <FormatComponent key={i} slideIndex={i + 1} />;
                })}
              </BlockComponent>
            );
          })}
        </>
      )}
    </main>
  );
};

export default Story;
