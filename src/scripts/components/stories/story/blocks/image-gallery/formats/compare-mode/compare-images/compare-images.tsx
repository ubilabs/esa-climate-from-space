import { useRef, FunctionComponent, useEffect } from "react";
import { motion, useMotionValue, AnimatePresence, animate } from "motion/react";
import { useGesture } from "@use-gesture/react";

import styles from "./compare-images.module.css";

interface Props {
  src1: string;
  alt1?: string;
  src2: string;
  alt2?: string;
  isComparing: boolean;
}

const PINCH_SCALE_FACTOR = 100;
const MIN_ZOOM_SCALE = 1;
const MAX_ZOOM_SCALE = 5;
const WHEEL_SCALE_FACTOR = 0.001;

export const CompareImages: FunctionComponent<Props> = ({
  src1,
  alt1,
  src2,
  alt2,
  isComparing,
}) => {
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

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
      onDrag: ({ offset: [dx, dy] }) => {
        x.set(dx);
        y.set(dy);
      },
      onPinch: ({ offset: [d] }) => {
        const s = Math.min(
          Math.max(d / PINCH_SCALE_FACTOR, MIN_ZOOM_SCALE),
          MAX_ZOOM_SCALE,
        );
        scale.set(s);
      },
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
    <div ref={containerRef} className={styles.compareContainer}>
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
