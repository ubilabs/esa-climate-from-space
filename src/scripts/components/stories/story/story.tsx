import { FunctionComponent, ReactNode, RefObject } from "react";

import {
  ImageGallery,
  ImageGalleryCompoundComponents,
  imageGalleryFormatMap,
} from "./blocks/image-gallery/image-gallery";
import { useContentParams } from "../../../hooks/use-content-params";
import { useGetStoryQuery } from "../../../services/api";

import styles from "./story.module.css";
import { SplashScreen } from "./splashscreen/splashscreen";
import { ImageGalleryBlock } from "../../../types/story";

const Story: FunctionComponent<{ ref: RefObject<HTMLDivElement | null> }> = ({
  ref,
}) => {
  const { currentStoryId } = useContentParams();

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
    <main className={styles.story} ref={ref} id="story">
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
                {/* <ContentComponent.CompareMode /> */}
                {/* <div>TEST</div> */}
                {contentBlock.blocks.map((block) => {
                  const FormatComponent = formatMap[block.type];

                  if (!FormatComponent) {
                    console.warn(
                      `No format component found for block type: ${block.type}`,
                    );
                    return null;
                  }

                  return <FormatComponent />;
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
