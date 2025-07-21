import { useState, useRef, FunctionComponent } from "react";
import { motion, useMotionValue } from "motion/react";
import { useGesture } from "@use-gesture/react";

import styles from "./caption-image.module.css";
import { FormattedMessage, useIntl } from "react-intl";

interface Props {
  src: string;
  alt: string;
}
const WHEEL_SCALE_FACTOR = 0.001,
  MIN_ZOOM_SCALE = 1,
  PINCH_SCALE_FACTOR = 100,
  MAX_ZOOM_SCALE = 5;

export const CaptionImage: FunctionComponent<Props> = ({ src, alt }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const intl = useIntl();
  // Motion values for drag and scale
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const imgRef = useRef(null);

  // Gesture bindings
  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        x.set(dx);
        y.set(dy);
      },
      onPinch: ({ offset: [d] }) => {
        const s = Math.min(Math.max(d / PINCH_SCALE_FACTOR, 1), MAX_ZOOM_SCALE); // limit zoom 1–5x
        scale.set(s);
      },
      onWheel: ({ event }) => {
        // prevent default scrolling
        if (isFullscreen) {
          event.preventDefault();
          const delta = -event.deltaY * WHEEL_SCALE_FACTOR;
          const newScale = Math.min(
            Math.max(scale.get() + delta, MIN_ZOOM_SCALE),
            MAX_ZOOM_SCALE,
          );
          scale.set(newScale);
        }
      },
    },
    {
      target: imgRef,
      eventOptions: { passive: false },
      drag: { from: () => [x.get(), y.get()] },
      pinch: { from: () => [scale.get() * 100, 0] }, // convert scale to %
      enabled: isFullscreen, // Only enable gestures when in fullscreen
    },
  );

  // Reset on close
  const handleClose = () => {
    scale.set(1);
    x.set(0);
    y.set(0);
    setIsFullscreen(false);
  };

  return (
    <motion.div
      layout
      className={
        isFullscreen ? styles.fullscreenOverlay : styles.imageContainer
      }
      role={isFullscreen ? "dialog" : undefined}
      aria-modal={isFullscreen ? "true" : undefined}
      aria-hidden={!isFullscreen}
    >
      <motion.img
        layout
        ref={imgRef}
        src={src}
        alt={alt || "Caption image"}
        className={styles.image}
        style={{
          x: isFullscreen ? x : 0,
          y: isFullscreen ? y : 0,
          scale: isFullscreen ? scale : 1,
          cursor: isFullscreen ? "grab" : "default",
        }}
        draggable={false}
      />

      {!isFullscreen && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen(true);
          }}
          className={styles.fullscreenButton}
          aria-label={intl.formatMessage({ id: "enterFullscreen" })}
        ></button>
      )}

      {isFullscreen && (
        <>
          <span aria-describedby="gesture-instructions">
            <FormattedMessage id={"zoomInstruction"} />
          </span>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label={intl.formatMessage({ id: "exitFullscreen" })}
          >
            ✕
          </button>
        </>
      )}
    </motion.div>
  );
};
