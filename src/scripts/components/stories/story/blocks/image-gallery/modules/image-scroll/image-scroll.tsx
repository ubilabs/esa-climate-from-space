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
  const { module, storyId, getRefCallback } = useModuleContent();
  return (
    <div className={styles.imageScroll}>
      {module.slides?.map((slide, index) => (
        <SlideContainer
          ref={getRefCallback?.(index)}
          className={cx(styles.slide, "story-grid")}
          key={slide.url || index}
        >
          {slide.description && (
            <ReactMarkdown
              children={slide.description}
              className={styles.imageScrollText}
            />
          )}
          <div className={styles.scrollImageContainer}>
            <ScrollImage
              src={getStoryAssetUrl(storyId, slide.url)}
              alt={slide.altText}
            />
            <ReactMarkdown
              children={slide.captions?.join("\n\n") || ""}
              allowedElements={config.markdownAllowedElements}
            />
          </div>
        </SlideContainer>
      ))}
    </div>
  );
};

export default ImageScroll;
