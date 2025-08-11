import { FunctionComponent, useRef } from "react";

import ReactMarkdown from "react-markdown";
import { motion, useTransform } from "motion/react";

import config from "../../../../../../../../config/main";

import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";
import { useStoryScroll } from "../../../../../../../../hooks/use-story-scroll";
import { ImageSlide } from "../../../../../../../../types/story";

import cx from "classnames";

import styles from "./scroll-overlay-slide.module.css";

interface CaptionProps {
  caption: string;
  subCaption?: string;
  index: number;
}

const Caption: FunctionComponent<CaptionProps> = ({ caption, index }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useStoryScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  const translateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    // For even indices, move left; for odd indices, move right
    index % 2 === 0 ? [-400, 0, 400] : [400, 0, -400],
  );

  return (
    <motion.div
      ref={ref}
      style={{
        opacity: opacity,
        translateX: translateX,
      }}
      className={cx(styles.captionContainer)}
    >
      <ReactMarkdown
        children={caption}
        allowedElements={config.markdownAllowedElements}
      />
    </motion.div>
  );
};

interface Props {
  slide: ImageSlide;
  storyId: string;
}

const isVideo = (url: string) => {
  return url.endsWith(".mp4") || url.endsWith(".webm");
};

export const ScrollOverlaySlide: FunctionComponent<Props> = ({
  slide,
  storyId,
}) => {
  const assetUrl = getStoryAssetUrl(storyId, slide?.url);
  const hasAsset = assetUrl && assetUrl.length > 0;

  return (
    <div
      className={cx(styles.slide)}
      style={{ height: `calc(${slide.captions.length} * var(--story-height))` }}
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
          <Caption key={index} caption={caption} index={index} />
        ))}
      </div>
    </div>
  );
};
