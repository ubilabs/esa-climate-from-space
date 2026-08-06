import { RefObject, useRef } from "react";
import { motion, useMotionValueEvent, useTransform } from "motion/react";
import { useScrollModule } from "../use-scroll-module";

import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";
import { useStory } from "../../../../../../../providers/story/use-story";

import cx from "classnames";

import styles from "./scroll-video.module.css";

interface Props<T> {
  className: string;
  src: string;
  inputRange?: Array<number>;
  outputRange?: Array<T>;
}

interface ScrollVideoConfig<T extends string | number> {
  video: {
    playBack: [number, number];
    input?: Array<number>;
    output?: Array<T>;
  };
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const syncVideoToProgress = (
  progress: number,
  videoRef: RefObject<HTMLVideoElement | null>,
  playBack: [number, number],
) => {
  const video = videoRef?.current;

  if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
    return;
  }

  const [playBackStart, playBackEnd] = playBack;

  if (playBackEnd <= playBackStart) {
    video.currentTime = progress >= playBackEnd ? video.duration : 0;
    return;
  }

  const playBackProgress = clamp(
    (progress - playBackStart) / (playBackEnd - playBackStart),
    0,
    1,
  );

  video.currentTime = playBackProgress * video.duration;
};

export default function ScrollVideo<T extends string | number>({
  className,
  src,
  inputRange = [1],
  outputRange = [1] as T[],
}: Props<T>) {
  const { scrollYProgress, config } = useScrollModule<ScrollVideoConfig<T>>();
  const { story } = useStory();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playBack = config.video.playBack;

  const storyVideoSrc = story ? getStoryAssetUrl(story.id, src) : src;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    syncVideoToProgress(latest, videoRef, playBack);
  });

  const videoInputRange = config.video.input ?? inputRange;
  const videoOutputRange = config.video.output ?? outputRange;

  return (
    <motion.video
      ref={videoRef}
      muted
      preload="metadata"
      src={storyVideoSrc}
      className={cx(styles.scrollVideo, className)}
      onLoadedMetadata={() => {
        syncVideoToProgress(scrollYProgress.get(), videoRef, playBack);
      }}
      style={{
        y: useTransform(scrollYProgress, videoInputRange, videoOutputRange),
      }}
    ></motion.video>
  );
}
