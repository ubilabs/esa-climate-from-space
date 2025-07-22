import { FunctionComponent, useRef } from "react";
import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";
import {
  ImageSlide,
  IntroImageSlide,
} from "../../../../../../../../types/story";
import styles from "./scroll-overlay-slide.module.css";
import cx from "classnames";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useStoryScroll } from "../../../../../../../../hooks/use-story-scroll";

interface Props {
  slide: ImageSlide | IntroImageSlide;
  storyId: string;
  isFirst: boolean;
}

const isVideo = (url: string) => {
  return url.endsWith(".mp4") || url.endsWith(".webm");
};

export const ScrollOverlaySlide: FunctionComponent<Props> = ({
  slide,
  storyId,
  isFirst,
}) => {
  const assetUrl = getStoryAssetUrl(storyId, slide.url);
  console.log("assetUrl", assetUrl);

  return (
    <div className={cx(styles.slide, isFirst && styles.first)}>
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
        <img
          className={styles.asset}
          src={assetUrl}
          alt={slide.altText || ""}
        />
      )}
      <div className={cx(styles.captionContainer)}>
        <>
          <h2>{slide.caption}</h2>
          {"subCaption" in slide && <h3>{slide.subCaption}</h3>}
        </>
      </div>
    </div>
  );
};
