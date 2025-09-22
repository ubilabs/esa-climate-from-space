import { useState, useRef, FunctionComponent, SyntheticEvent } from "react";
import { useIntl } from "react-intl";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useGesture } from "@use-gesture/react";
import { useScreenSize } from "../../../../../../../../hooks/use-screen-size";
import { useStoryScroll } from "../../../../../../../../hooks/use-story-scroll";
import { useLenisToggle } from "../../../../../../../../hooks/use-lenis-toggle";

import { InstructionOverlay } from "../../../../../../../ui/instruction-overlay/instruction-overlay";
import {
  MAX_ZOOM_SCALE,
  MIN_ZOOM_SCALE,
  PINCH_SCALE_FACTOR,
  WHEEL_SCALE_FACTOR,
} from "../../../../../../../../config/main";

import cx from "classnames";

import styles from "./image-scroll-image.module.css";

interface Props {
  src: string;
  alt?: string;
  className?: string;
}

export const ScrollImage: FunctionComponent<Props> = ({ src, alt, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const intl = useIntl();
  const { isMobile } = useScreenSize();

  useLenisToggle(isFullscreen);

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

  const { scrollYProgress } = useStoryScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0.5, 1],
    ["inset(10% 10% 10% 10%)", "inset(0% 0% 0% 0%)"],
  );

  const buttonOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

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

  if (!alt) {
    console.warn(
      "CaptionImage component requires an alt text for accessibility.",
    );
  }

  return (
    <motion.div
      ref={ref}
      layout
      data-status={isFullscreen ? "fullscreenOverlay" : "imageContainer"}
      role={isFullscreen ? "dialog" : undefined}
      aria-modal={isFullscreen ? "true" : undefined}
    >
      <motion.img
        layout
        ref={imgRef}
        src={src}
        alt={alt}
        className={cx( styles.image, className)}
        style={{
          x: isFullscreen ? x : 0,
          y: isFullscreen ? y : 0,
          scale: isFullscreen ? scale : 1,
          cursor: isFullscreen ? "grab" : "default",
          clipPath: isFullscreen ? "none" : clipPath,
        }}
        draggable={false}
      />

      {!isFullscreen && (
        <motion.button
          onClick={handleOpen}
          className={styles.fullscreenButton}
          aria-label={intl.formatMessage({ id: "enterFullscreen" })}
          style={{ opacity: buttonOpacity }}
        ></motion.button>
      )}

      {isFullscreen && (
        <>
          {isMobile && (
            <InstructionOverlay
              show={showInstructions}
              messageId="zoomInstruction"
            />
          )}
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
