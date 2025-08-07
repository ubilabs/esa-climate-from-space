import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import { useFormat } from "../../../../../../../providers/story/format/use-format";
import { FormatContainer } from "../../../../../layout/format-container/format-container";
import { StorySectionProps } from "../../../../../../../types/story";
import { CaptionImage } from "./caption-image/caption-image";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";

import styles from "./scroll-caption.module.css";

const ScrollCaption: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const { content, storyId } = useFormat();

  return (
    <FormatContainer ref={ref} className={styles.scrollCaptionBlock}>
      {content.slides.map((slide, index) => (
        <div className={styles.scrollCaptionSlide} key={index}>
          {slide.text && (
            <ReactMarkdown
              children={slide.text}
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
              allowedElements={["h3", "p", "br", "em", "b", "a"]}
            />
          </div>
        </div>
      ))}
    </FormatContainer>
  );
};

export default ScrollCaption;
