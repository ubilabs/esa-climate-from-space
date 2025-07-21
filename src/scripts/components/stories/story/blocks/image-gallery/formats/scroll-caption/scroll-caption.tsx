import { FunctionComponent } from "react";
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
        <div key={index} className={styles.scrollImageContainer}>
          <CaptionImage src={getStoryAssetUrl(storyId, slide.url)} alt={slide.altText} />
          <h3>{slide.caption}</h3>
          <p>{slide.altText}</p>
        </div>
      ))}
    </FormatContainer>
  );
};

export default ScrollCaption;
