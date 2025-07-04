import { FunctionComponent, ReactNode, useEffect, useRef } from "react";

import {
  ImageGallery,
  ImageGalleryCompoundComponents,
  imageGalleryFormatMap,
} from "./blocks/image-gallery/image-gallery";
import { useContentParams } from "../../../hooks/use-content-params";
import { useGetStoryQuery } from "../../../services/api";

import styles from "./story.module.css";
import { ImageGalleryBlock } from "../../../types/story";
import { SplashScreen } from "./blocks/splashscreen/splashscreen";
import {
  useStoryContext,
  useUpdateControllerOnRouteChange,
} from "../stories-parallex-provider/stories-parallex";

const Story: FunctionComponent = () => {
  const { currentStoryId } = useContentParams();
  const storyElement = useRef<HTMLDivElement | null>(null);
  useUpdateControllerOnRouteChange();

  const { setParallaxProviderProps } = useStoryContext();
  useEffect(() => {
    if (!storyElement.current) {
      return;
    }

    setParallaxProviderProps({ scrollContainer: storyElement.current });
  }, [setParallaxProviderProps]);

  const { data: selectedStory } = useGetStoryQuery({
    id: currentStoryId,
    language: "en",
  });

  const contentBlockMap:
    | Record<
      string,
      FunctionComponent<{ children: ReactNode }> &
      ImageGalleryCompoundComponents
    >
    | undefined = {
    imageGallery: ImageGallery,
  };

  const formatMap: Record<ImageGalleryBlock["type"], FunctionComponent> = {
    ...imageGalleryFormatMap,
  };

  return (
    <main className={styles.story} ref={storyElement} id="story">
      {selectedStory && (
        <>
          <SplashScreen />
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

                  return <FormatComponent key={i}/>;
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
