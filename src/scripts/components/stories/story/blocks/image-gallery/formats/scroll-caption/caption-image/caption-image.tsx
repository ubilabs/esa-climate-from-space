import { useState, useRef, FunctionComponent } from "react";
import { motion, useMotionValue } from "motion/react";
import { useGesture } from "@use-gesture/react";

import styles from "./caption-image.module.css";

interface Props {
  src: string; // Image source
}

export const CaptionImage: FunctionComponent<Props> = ({ src }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

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
        const s = Math.min(Math.max(d / 100, 1), 5); // limit zoom 1–5x
        scale.set(s);
      },
      onWheel: ({ event }) => {
        // prevent default scrolling
        event.preventDefault();
        const delta = -event.deltaY * 0.001;
        const newScale = Math.min(Math.max(scale.get() + delta, 1), 5);
        scale.set(newScale);
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
    >
      <motion.img
        layout
        ref={imgRef}
        src={src}
        alt="Zoomable"
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
        ></button>
      )}

      {isFullscreen && (
        <>
          <span>Zoom with two fingers, move with one</span>
          <button onClick={handleClose} className={styles.closeButton}>
            ✕
          </button>
        </>
      )}
    </motion.div>
  );
};
