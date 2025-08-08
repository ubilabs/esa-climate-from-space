import { useState, useRef, FunctionComponent, SyntheticEvent } from "react";
import { useIntl } from "react-intl";
import { motion, useMotionValue } from "motion/react";
import { useGesture } from "@use-gesture/react";

import { InstructionOverlay } from "../../../../../../../ui/instruction-overlay/instruction-overlay";
import {
  MAX_ZOOM_SCALE,
  MIN_ZOOM_SCALE,
  PINCH_SCALE_FACTOR,
  WHEEL_SCALE_FACTOR,
} from "../../../../../../../../config/main";

import styles from "./caption-image.module.css";

interface Props {
  src: string;
  alt: string;
}

export const CaptionImage: FunctionComponent<Props> = ({ src, alt }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const intl = useIntl();
  // Motion values for drag and scale
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const imgRef = useRef(null);

  const hideInstructions = () => {
    if (showInstructions) {
      setShowInstructions(false);
    }
  };

  // Gesture bindings
  useGesture(
    {
      onDragStart: hideInstructions,
      onDrag: ({ offset: [dx, dy] }) => {
        x.set(dx);
        y.set(dy);
      },
      onPinchStart: hideInstructions,
      onPinch: ({ offset: [d] }) => {
        const s = Math.min(Math.max(d / PINCH_SCALE_FACTOR, 1), MAX_ZOOM_SCALE); // limit zoom 1–5x
        scale.set(s);
      },
      onWheelStart: hideInstructions,
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

  const handleOpen = (e: SyntheticEvent) => {
    e.stopPropagation();
    setIsFullscreen(true);
    setShowInstructions(true);
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
          onClick={handleOpen}
          className={styles.fullscreenButton}
          aria-label={intl.formatMessage({ id: "enterFullscreen" })}
        ></button>
      )}

      {isFullscreen && (
        <>
          <InstructionOverlay
            show={showInstructions}
            messageId="zoomInstruction"
          />
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
