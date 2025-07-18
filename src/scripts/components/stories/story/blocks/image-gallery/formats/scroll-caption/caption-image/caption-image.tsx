import { useState, useRef, FunctionComponent } from "react";
import { motion, useMotionValue, AnimatePresence } from "motion/react";
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
    <div>
      <button onClick={() => setIsFullscreen(true)}>🔍</button>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className={styles.fullscreenOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              ref={imgRef}
              src={src}
              alt="Zoomable"
              style={{
                x,
                y,
                scale,
                cursor: "grab",
                maxWidth: "100%",
                maxHeight: "100%",
                userSelect: "none",
                touchAction: "none",
              }}
              draggable={false}
            />

            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                fontSize: "2rem",
                color: "white",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
