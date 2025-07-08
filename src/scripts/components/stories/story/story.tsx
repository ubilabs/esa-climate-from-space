import {
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";

import {
  ImageGallery,
  ImageGalleryCompoundComponents,
  imageGalleryFormatMap,
} from "./blocks/image-gallery/image-gallery";
import { useContentParams } from "../../../hooks/use-content-params";
import { useGetStoryQuery } from "../../../services/api";

import { ImageGalleryBlock, StorySectionProps } from "../../../types/story";
import { SplashScreen } from "./blocks/splashscreen/splashscreen";

import cx from "classnames";

import styles from "./story.module.css";
import { useUpdateControllerOnRouteChange } from "../../../providers/parallax/use-parallax-config";
import { useStory } from "../../../providers/story/use-story";
// import { NavigationObserver } from "../utils/navigation-observer";

const Story: FunctionComponent = () => {
  const { currentStoryId } = useContentParams();
  useUpdateControllerOnRouteChange();

  const { setStory, setStoryElement, storyElement } = useStory();

  // useLayoutEffect(() => {
  //   // const storyElements = storyElement?.querySelectorAll("#chapterSequence");
  //   // console.log("storyElements", storyElements);
  // }, [storyElement]);
  // // chapterNav.observe()

  // A callback Ref ensures setStoryElement is called the moment the DOM node is available. We are using similar approach in globe.tsx
  const callbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        setStoryElement(node);
      }
    },
    [setStoryElement],
  );

  const { data: selectedStory } = useGetStoryQuery({
    id: currentStoryId,
    language: "en",
  });

  useEffect(() => {
    if (selectedStory) {
      setStory(selectedStory);
    }
  }, [selectedStory, setStory]);

  if (!selectedStory) {
    console.warn(
      `No story found for id: ${currentStoryId}. Please check the story ID or ensure the story exists.`,
    );
    return null;
  }

  const contentBlockMap:
    | Record<
        string,
        FunctionComponent<{ children: ReactNode }> &
          ImageGalleryCompoundComponents
      >
    | undefined = {
    imageGallery: ImageGallery,
  };

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
      {selectedStory && (
        <>
          <SplashScreen slideIndex={0} />
          {selectedStory.content.map((contentBlock, idx) => {
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
