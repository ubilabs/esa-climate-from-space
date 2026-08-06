import { motion, useTransform } from "motion/react";
import { AnimatedArrowsConfig } from "../../animated-arrows/animated-arrows";
import { useScrollModule } from "../use-scroll-module";

import cx from "classnames";

import styles from "./scroll-video.module.css";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";
import { useStory } from "../../../../../../../providers/story/use-story";

interface Props<T> {
  className: string;
  src: string;
  inputRange?: Array<number>;
  outputRange?: Array<T>;
}

export default function ScrollVideo<T extends string | number>({
  className,
  src,
  inputRange = [1],
  outputRange = [1] as T[],
}: Props<T>) {
  const { scrollYProgress } = useScrollModule<AnimatedArrowsConfig>();
  const {
    story: { id },
  } = useStory();

  const storyVideoSrc = getStoryAssetUrl(id, src);
  console.log("🚀 ~ scroll-video.tsx:29 → storyVideoSrc:", storyVideoSrc);

  return (
    <motion.video
      controls
      muted
      src={storyVideoSrc}
      className={cx(styles.scrollVideo, className)}
      style={{
        y: useTransform(scrollYProgress, inputRange, outputRange),
      }}
    ></motion.video>
  );
}
