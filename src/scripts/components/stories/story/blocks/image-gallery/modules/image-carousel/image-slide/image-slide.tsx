import React from "react";
import cx from "classnames";

import { ScrollImage } from "../../image-scroll/image-scroll-image/image-scroll-image";
import { StoryMarkdown } from "../../../../../../../shared/story-markdown/story-markdown";

import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";

import config from "../../../../../../../../config/main";

import { ImageCarouselSlide } from "../../../../../../../../types/story";

import styles from "./image-slide.module.css";

interface ImageSlideProps {
  slide: ImageCarouselSlide;
  index: number;
  isFullscreen: boolean;
  fullscreenSlideIndex: number | undefined;
  slideElementRef?: React.Ref<HTMLDivElement>;
  storyId: string;
  setIsSlideTouched: (touched: boolean) => void;
  setFullscreenSlideIndex: (index: number | undefined) => void;
}

const ImageSlide: React.FC<ImageSlideProps> = ({
  slide,
  index,
  isFullscreen,
  fullscreenSlideIndex,
  slideElementRef,
  storyId,
  setIsSlideTouched,
  setFullscreenSlideIndex,
}) => {
  const { url = "", altText = "", text } = slide;
  return (
    <div
      ref={slideElementRef}
      onTouchStart={() => setIsSlideTouched(true)}
      onTouchEnd={() => setIsSlideTouched(false)}
      className={cx(styles.slide)}
      style={
        isFullscreen && fullscreenSlideIndex !== index
          ? { display: "none" }
          : undefined
      }
    >
      <div className={cx(styles.imageContainer)}>
        <ScrollImage
          className={styles.image}
          src={getStoryAssetUrl(storyId, url)}
          alt={altText}
          onFullscreenToggle={(isFullscreen: boolean) =>
            setFullscreenSlideIndex(isFullscreen ? index : undefined)
          }
        />
      </div>
      {text && !isFullscreen && (
        <div className={cx(styles.text)}>
          <StoryMarkdown
            storyId={storyId}
            allowedElements={config.markdownAllowedElements}
          >
            {text}
          </StoryMarkdown>
        </div>
      )}
    </div>
  );
};

export default ImageSlide;
