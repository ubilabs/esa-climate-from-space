import { FunctionComponent, useEffect, useRef } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import { useGesture } from "@use-gesture/react";

import cx from "classnames";

import { ImageModuleSlide } from "../../../../../../../../types/story";
import { useScreenSize } from "../../../../../../../../hooks/use-screen-size";
import { useLenisToggle } from "../../../../../../../../hooks/use-lenis-toggle";
import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";

import {
  MAX_ZOOM_SCALE,
  MIN_ZOOM_SCALE,
  PINCH_SCALE_FACTOR,
  WHEEL_SCALE_FACTOR,
} from "../../../../../../../../config/main";

import styles from "./comparison-viewer.module.css";

interface Props {
  slide1: ImageModuleSlide;
  slide2: ImageModuleSlide;
  storyId: string;
  isComparing: boolean;
  onInteraction?: () => void;
}

export const ComparisonViewer: FunctionComponent<Props> = ({
  slide1,
  slide2,
  storyId,
  isComparing,
  onInteraction,
}) => {
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const isMobile = useScreenSize().isMobile;

  // Extract image URLs and alt texts from the slides
  const { url: url1, altText: alt1 } = slide1;
  const { url: url2, altText: alt2 } = slide2;

  const src1 = getStoryAssetUrl(storyId, url1);
  const src2 = getStoryAssetUrl(storyId, url2);

  const containerRef = useRef(null);

  useLenisToggle(isComparing, containerRef);

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

  const animateProp = isMobile ? "height" : "width";

  return (
    <div
      // We need to force a re-evaluation of the motion values when the animateProp changes
      key={animateProp}
      ref={containerRef}
      className={cx(
        styles.comparisonViewer,
        !isMobile && styles.isVerticalSplit,
        isComparing && styles.isComparing,
      )}
    >
      <motion.div
        className={styles.imageWrapper}
        animate={{ [animateProp]: isComparing ? "50%" : "100%" }}
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
            initial={{ [animateProp]: "0%" }}
            animate={{ [animateProp]: "50%" }}
            exit={{ [animateProp]: "0%" }}
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
