import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";

import config from "../../../../../../../config/main";

import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import { SlideContainer } from "../../../../../layout/slide-container/slide-container";
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
      {slides?.map(({ url, text, altText, caption, focus }, index) => (
        <SlideContainer
          ref={getRefCallback?.(index, 0)}
          className={cx(styles.slide, "story-grid")}
          key={url || index}
        >
          {text && (
            <div className={styles.imageScrollText}>
              <ReactMarkdown children={text} />
            </div>
          )}
          <div className={styles.scrollImageContainer}>
            <ScrollImage
              className={focus}
              src={getStoryAssetUrl(storyId, url)}
              alt={altText || text}
            />
            <ReactMarkdown
              children={caption}
              allowedElements={config.markdownAllowedElements}
            />
          </div>
        </SlideContainer>
      ))}
    </div>
  );
};

export default ImageScroll;
