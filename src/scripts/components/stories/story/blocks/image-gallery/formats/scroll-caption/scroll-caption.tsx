import { FunctionComponent } from "react";
import { useFormat } from "../../../../../../../providers/story/format/use-format";
import { FormatContainer } from "../../../../../layout/format-container/format-container";
import { StorySectionProps } from "../../../../../../../types/story";

import styles from "./scroll-caption.module.css";
import { CaptionImage } from "./caption-image/caption-image";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";

const ScrollCaption: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const { content, storyId } = useFormat();
  console.log("ScrollCaption content:", content, "storyId:", storyId);

  return (
    <FormatContainer ref={ref}>
      {content.slides.map((slide, index) => {
        return <CaptionImage src={getStoryAssetUrl(storyId, slide.url)} key={index} />;
      })}
      <div className={styles.scrollCaptionContainer}></div>
    </FormatContainer>
  );
};

export default ScrollCaption;
