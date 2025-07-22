import { FunctionComponent, useRef } from "react";
import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";
import { ImageSlide } from "../../../../../../../../types/story";
import styles from "./scroll-overlay-slide.module.css";
import cx from "classnames";
import {
  useMotionValueEvent,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useStoryScroll } from "../../../../../../../../hooks/use-story-scroll";

interface Props {
  slide: ImageSlide;
  storyId: string;
  isFirst?: boolean;
  mainCaption?: string;
  mainSubCaption?: string;
}

const isVideo = (url: string) => {
  return url.endsWith(".mp4") || url.endsWith(".webm");
};

export const ScrollOverlaySlide: FunctionComponent<Props> = ({
  slide,
  storyId,
  isFirst = false,
  mainCaption,
  mainSubCaption,
}) => {
  const assetUrl = getStoryAssetUrl(storyId, slide.url);

  return (
    <div className={styles.slide}>
      {isVideo(slide.url) ? (
        <video
          className={styles.asset}
          src={assetUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img className={styles.asset} src={assetUrl} alt={slide.altText || ""} />
      )}
      <div className={styles.overlay} />
      <div className={cx(styles.captionContainer, isFirst && styles.first)}>
        {isFirst ? (
          <>
            <h1>{mainCaption}</h1>
            {mainSubCaption && <p>{mainSubCaption}</p>}
          </>
        ) : (
          <h2>{slide.caption}</h2>
        )}
      </div>
    </div>
  );
};
