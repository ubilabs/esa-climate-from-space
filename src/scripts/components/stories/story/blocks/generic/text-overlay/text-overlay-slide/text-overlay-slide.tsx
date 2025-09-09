import { FunctionComponent, useRef } from "react";

import ReactMarkdown from "react-markdown";
import { motion, useTransform } from "motion/react";

import config from "../../../../../../../config/main";

import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";
import { useStoryScroll } from "../../../../../../../hooks/use-story-scroll";
import { ImageModuleSlide } from "../../../../../../../types/story";

import cx from "classnames";

import styles from "./text-overlay-slide.module.css";

interface CaptionProps {
  caption: string;
  className?: string;
  index?: number;
}

const TRANSLATE_DISTANCE = 300;

export const Caption: FunctionComponent<CaptionProps> = ({
  caption,
  index = 0,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useStoryScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  const translateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    // For even indices, move left; for odd indices, move right
    index % 2 === 0
      ? [-TRANSLATE_DISTANCE, 0, TRANSLATE_DISTANCE]
      : [TRANSLATE_DISTANCE, 0, -TRANSLATE_DISTANCE],
  );

  return (
    <motion.section
      tabIndex={-1}
      ref={ref}
      style={{
        opacity: opacity,
        translateY: translateY,
      }}
      className={cx(styles.captionContainer, "story-grid", className)}
    >
      <div className={styles.caption}>
        <ReactMarkdown
          children={caption}
          allowedElements={config.markdownAllowedElements}
        />
      </div>
    </motion.section>
  );
};

interface Props {
  slide: ImageModuleSlide;
  storyId: string;
  getRefCallback: (index: number) => (element: HTMLDivElement) => void;
}

const isVideo = (url: string | undefined) => {
  return url?.endsWith(".mp4") || url?.endsWith(".webm") || false;
};

export const TextOverlaySlide: FunctionComponent<Props> = ({
  slide,
  storyId,
  getRefCallback,
}) => {
  const assetUrl = getStoryAssetUrl(storyId, slide?.url);
  const hasAsset = assetUrl && assetUrl.length > 0;

  if (!slide.captions || slide.captions.length === 0) {
    console.warn(
      `TextOverlaySlide: Slide for story ${storyId} has no captions, skipping rendering.`,
    );
    return null;
  }

  return (
    <div
      className={cx(styles.slide)}
      style={{
        height: `calc(${slide.captions?.length} * var(--story-height))`,
      }}
    >
      <div className={styles.assetContainer}>
        {hasAsset &&
          (isVideo(slide.url) ? (
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
          ))}
      </div>
      <div className={styles.captionsContainer}>
        {slide.captions.map((caption, index) => (
          <div ref={getRefCallback(index)} key={index}>
            <Caption key={index} caption={caption} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};
