import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";

import config from "../../../../../../../config/main";

import { useFormat } from "../../../../../../../providers/story/format/use-format";
import { FormatContainer } from "../../../../../layout/format-container/format-container";
import { StorySectionProps } from "../../../../../../../types/story";
import { CaptionImage } from "./caption-image/caption-image";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";

import styles from "./scroll-caption.module.css";

const ScrollCaption: FunctionComponent<StorySectionProps> = ({
  getRefCallback,
}) => {
  const { content, storyId } = useFormat();
  return (
    <div className={styles.scrollCaptionBlock}>
      {content.slides.map((slide, index) => (
        <FormatContainer
          ref={getRefCallback?.(index)}
          className={styles.scrollCaptionSlide}
          key={index}
        >
          {slide.description && (
            <ReactMarkdown
              children={slide.description}
              className={styles.scrollCaptionText}
            />
          )}
          <div className={styles.scrollImageContainer}>
            <CaptionImage
              src={getStoryAssetUrl(storyId, slide.url)}
              alt={slide.altText}
            />
            <ReactMarkdown
              children={slide.captions.join("\n\n")}
              allowedElements={config.markdownAllowedElements}
            />
          </div>
        </FormatContainer>
      ))}
    </div>
  );
};

export default ScrollCaption;
