import { FunctionComponent, useRef } from "react";

import cx from "classnames";

import { motion, useTransform } from "motion/react";
import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";
import { useStoryScroll } from "../../../../../../../../hooks/use-story-scroll";
import { ImageSlide } from "../../../../../../../../types/story";

import styles from "./scroll-overlay-slide.module.css";

interface Props {
  slide: ImageSlide;
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
  const ref = useRef<HTMLDivElement>(null);
  const assetUrl = getStoryAssetUrl(storyId, slide.url);

  const { scrollYProgress } = useStoryScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const captionOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0],
  );

  const captionTransform = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["500px", "0px", "500px"],
  );

  return (
    <div ref={ref} className={cx(styles.slide, isFirst && styles.first)}>
      <div className={styles.assetContainer}>
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
      </div>
      <motion.div
        style={{
          opacity: captionOpacity,
          x: captionTransform,
        }}
        className={cx(styles.captionContainer)}
      >
        <>
          <h2>{slide.caption}</h2>
          {slide.subCaption && <h3>{slide.subCaption}</h3>}
        </>
      </motion.div>
    </div>
  );
};
