import { FunctionComponent, useEffect, useRef } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import { useGesture } from "@use-gesture/react";

import cx from "classnames";

import { ImageSlide } from "../../../../../../../../types/story";
import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";

import {
  MAX_ZOOM_SCALE,
  MIN_ZOOM_SCALE,
  PINCH_SCALE_FACTOR,
  WHEEL_SCALE_FACTOR,
} from "../../../../../../../../config/main";

import styles from "./compare-images.module.css";

interface Props {
  slide1: ImageSlide;
  slide2: ImageSlide;
  storyId: string;
  isComparing: boolean;
  onInteraction?: () => void;
}

export const CompareImages: FunctionComponent<Props> = ({
  slide1,
  slide2,
  storyId,
  isComparing,
  onInteraction
}) => {
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Extract image URLs and alt texts from the slides
  const { url: url1, altText: alt1 } = slide1;
  const { url: url2, altText: alt2 } = slide2;

  const src1 = getStoryAssetUrl(storyId, url1);
  const src2 = getStoryAssetUrl(storyId, url2);

  const containerRef = useRef(null);

  // Reset position and scale when exiting compare mode
  useEffect(() => {
    if (!isComparing) {
      animate(scale, 1);
      animate(x, 0);
      animate(y, 0);
    }
  }, [isComparing, scale, x, y]);

  useGesture(
    {
      onDragStart: onInteraction,
      onDrag: ({ offset: [dx, dy] }) => {
        x.set(dx);
        y.set(dy);
      },
      onPinchStart: onInteraction,
      onPinch: ({ offset: [d] }) => {
        const s = Math.min(
          Math.max(d / PINCH_SCALE_FACTOR, MIN_ZOOM_SCALE),
          MAX_ZOOM_SCALE,
        );
        scale.set(s);
      },
      onWheelStart: onInteraction,
      onWheel: ({ event }) => {
        event.preventDefault();
        const delta = -event.deltaY * WHEEL_SCALE_FACTOR;
        const newScale = Math.min(
          Math.max(scale.get() + delta, MIN_ZOOM_SCALE),
          MAX_ZOOM_SCALE,
        );
        scale.set(newScale);
      },
    },
    {
      target: containerRef,
      eventOptions: { passive: false },
      drag: { from: () => [x.get(), y.get()] },
      pinch: { from: () => [scale.get() * PINCH_SCALE_FACTOR, 0] },
      enabled: isComparing, // Only enable gestures when comparing
    },
  );

  return (
    <div
      ref={containerRef}
      className={cx(styles.compareContainer, isComparing && styles.isComparing)}
    >
      <motion.div
        className={styles.imageWrapper}
        animate={{ height: isComparing ? "50%" : "100%" }}
      >
        <motion.img
          src={src1}
          alt={alt1}
          className={styles.image}
          style={{ x, y, scale }}
          draggable={false}
        />
      </motion.div>
      <AnimatePresence>
        {isComparing && (
          <motion.div
            className={styles.imageWrapper}
            initial={{ height: "0%" }}
            animate={{ height: "50%" }}
            exit={{ height: "0%" }}
          >
            <motion.img
              src={src2}
              alt={alt2}
              className={styles.image}
              style={{ x, y, scale }}
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
