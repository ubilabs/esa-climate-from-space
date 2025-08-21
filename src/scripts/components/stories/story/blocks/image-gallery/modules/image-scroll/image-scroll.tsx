import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";

import config from "../../../../../../../config/main";

import { useFormat } from "../../../../../../../providers/story/format/use-format";
import { FormatContainer } from "../../../../../layout/format-container/format-container";
import { StorySectionProps } from "../../../../../../../types/story";
import { ScrollImage } from "./image-scroll-image/image-scroll-image";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";

import styles from "./image-scroll.module.css";

const ImageScroll: FunctionComponent<StorySectionProps> = ({
  getRefCallback,
}) => {
  const { content, storyId } = useFormat();
  return (
    <div className={styles.imageScroll}>
      {content.slides.map((slide, index) => (
        <FormatContainer
          ref={getRefCallback?.(index)}
          className={styles.slide}
          key={index}
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
              children={slide.captions.join("\n\n")}
              allowedElements={config.markdownAllowedElements}
            />
          </div>
        </FormatContainer>
      ))}
    </div>
  );
};

export default ImageScroll;
