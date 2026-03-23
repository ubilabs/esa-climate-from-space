import { FunctionComponent } from "react";

import { StoryMarkdown } from "../../../../../../shared/story-markdown/story-markdown";
import config from "../../../../../../../config/main";

import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import { SlideContainer } from "../../../../../layout/slide-container/slide-container";
import { TextBlock } from "../../../generic/text-container/text-block/text-block";
import { StorySectionProps } from "../../../../../../../types/story";
import { ScrollImage } from "./image-scroll-image/image-scroll-image";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";

import cx from "classnames";

import styles from "./image-scroll.module.css";

const ImageScroll: FunctionComponent<StorySectionProps> = () => {
  const {
    module: { slides },
    storyId,
    getRefCallback,
  } = useModuleContent();
  return (
    <div className={styles.imageScroll}>
      {slides?.map(
        // Set leading as default so image appears on the left / on top
        ({ url, text, altText, caption, focus, leading = true }, index) => (
          <SlideContainer
            ref={getRefCallback?.(index, 0)}
            className={cx(
              leading && styles.imageLeading,
              styles.slide,
              "story-grid",
            )}
            key={url || index}
          >
            {text && (
              <TextBlock
                text={text}
                storyId={storyId}
                hasRichText
                className={styles.imageScrollText}
              />
            )}
            <div className={styles.scrollImageContainer}>
              <ScrollImage
                className={cx(focus)}
                src={getStoryAssetUrl(storyId, url)}
                alt={altText || text}
              />
              <StoryMarkdown
                storyId={storyId}
                allowedElements={config.markdownAllowedElements}
              >
                {caption}
              </StoryMarkdown>
            </div>
          </SlideContainer>
        ),
      )}
    </div>
  );
};

export default ImageScroll;
