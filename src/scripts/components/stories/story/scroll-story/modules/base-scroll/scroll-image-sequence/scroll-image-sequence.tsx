import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useTransform } from "motion/react";
import { useScrollModule } from "../use-scroll-module";

import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";
import {
  getImageSequenceFrameIndex,
  getImageSequenceFrameSrc,
  ImageSequenceSource,
} from "../../../../../../../libs/image-sequence";
import { useStory } from "../../../../../../../providers/story/use-story";

import cx from "classnames";

import styles from "./scroll-image-sequence.module.css";

interface Props<T> {
  className: string;
  sequence: ImageSequenceSource;
  inputRange?: Array<number>;
  outputRange?: Array<T>;
}

interface ScrollImageSequenceConfig<T extends string | number> {
  imageSequence: {
    playback: [number, number];
    input?: Array<number>;
    output?: Array<T>;
  };
}

export default function ScrollImageSequence<T extends string | number>({
  className,
  sequence,
  inputRange = [1],
  outputRange = [1] as T[],
}: Props<T>) {
  const { scrollYProgress, config } =
    useScrollModule<ScrollImageSequenceConfig<T>>();

  const { story } = useStory();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Array<HTMLImageElement | undefined>>([]);
  const lastRenderedFrameRef = useRef(-1);
  const pendingFrameRef = useRef(0);
  const playback = config.imageSequence.playback;

  const frameBasePath = getStoryAssetUrl(story?.id ?? "", sequence.path);

  const drawFrame = (frameIndex: number) => {
    const image = imagesRef.current[frameIndex];
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (
      !image ||
      !canvas ||
      !context ||
      !image.complete ||
      !image.naturalWidth
    ) {
      return false;
    }

    if (
      canvas.width !== image.naturalWidth ||
      canvas.height !== image.naturalHeight
    ) {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    lastRenderedFrameRef.current = frameIndex;

    return true;
  };

  useEffect(() => {
    imagesRef.current = new Array(sequence.frameCount);
    lastRenderedFrameRef.current = -1;
    pendingFrameRef.current = getImageSequenceFrameIndex(
      scrollYProgress.get(),
      playback,
      sequence.frameCount,
    );

    let isCancelled = false;

    for (let index = 0; index < sequence.frameCount; index += 1) {
      const image = new Image();

      image.decoding = "async";
      image.src = getImageSequenceFrameSrc(frameBasePath, sequence, index);
      image.onload = () => {
        if (isCancelled) {
          return;
        }

        if (index === pendingFrameRef.current) {
          drawFrame(index);
          return;
        }

        if (index === 0 && lastRenderedFrameRef.current === -1) {
          drawFrame(index);
        }
      };
      image.onerror = () => {
        console.warn(`Failed to load image sequence frame: ${image.src}`);
      };

      imagesRef.current[index] = image;
    }

    return () => {
      isCancelled = true;
      imagesRef.current = [];
    };
  }, [frameBasePath, playback, scrollYProgress, sequence]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const frameIndex = getImageSequenceFrameIndex(
      latest,
      playback,
      sequence.frameCount,
    );

    pendingFrameRef.current = frameIndex;

    if (frameIndex === lastRenderedFrameRef.current) {
      return;
    }

    drawFrame(frameIndex);
  });

  const imageSequenceInputRange = config.imageSequence.input ?? inputRange;
  const imageSequenceOutputRange = config.imageSequence.output ?? outputRange;

  return (
    <motion.div
      className={cx(styles.sequenceContainer, className)}
      style={{
        y: useTransform(
          scrollYProgress,
          imageSequenceInputRange,
          imageSequenceOutputRange,
        ),
      }}
    >
      <canvas
        ref={canvasRef}
        className={styles.scrollImageSequence}
        aria-hidden="true"
      />
    </motion.div>
  );
}
