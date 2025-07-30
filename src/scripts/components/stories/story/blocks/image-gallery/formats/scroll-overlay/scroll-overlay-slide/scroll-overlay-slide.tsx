import { FunctionComponent, useRef } from "react";
import cx from "classnames";
import {
  motion,
  useTransform,
  MotionValue,
  useMotionValueEvent,
} from "motion/react";
import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";
import { useStoryScroll } from "../../../../../../../../hooks/use-story-scroll";
import { ImageSlide } from "../../../../../../../../types/story";
import styles from "./scroll-overlay-slide.module.css";

interface CaptionProps {
  caption: string;
  subCaption?: string;
  scrollYProgress: MotionValue<number>;
  index: number;
  totalCaptions: number;
}

const Caption: FunctionComponent<CaptionProps> = ({
  caption,
  subCaption,
  index,
  totalCaptions,
}) => {
  // const numSteps = totalCaptions > 1 ? totalCaptions + 1 : totalCaptions;
  // const step = 1 / numSteps;
  // const start = step * index;
  // const end = start + step;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useStoryScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  console.log("index", index, "scrollprocess", scrollYProgress);
  useMotionValueEvent(scrollYProgress, "change", (e) => {
    if (index === 1) {
      console.log("e", e);
    }
  });
  // const numSteps = totalCaptions > 1 ? totalCaptions + 1 : totalCaptions;
  // const step = 1 / numSteps;
  // const start = 0.5 - step / 2 + step * index;
  // const end = start + step;


  const captionOpacity = useTransform(
    scrollYProgress,
    [0,1],
    [0, 1],
  );

  const captionTransform = useTransform(
    scrollYProgress,
    [0,1],
    ["100px", "-100px"], // symmetrical vertical movement
  );
  return (
    <motion.div
      ref={ref}
      style={{
        backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.random()})`,
        opacity: captionOpacity,
        x: captionTransform,
      }}
      className={cx(styles.captionContainer)}
    >
      <h2>{caption}</h2>
      {subCaption && <h3>{subCaption}</h3>}
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
      style={{ height: `calc(2 * var(--story-height))` }}
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
      {slide.captions.map((caption, index) => (
        <Caption
          key={index}
          caption={caption}
          subCaption={slide.subCaption}
          index={index}
          totalCaptions={slide.captions.length}
        />
      ))}
    </div>
  );
};
