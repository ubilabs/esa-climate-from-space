import { useState, useRef, useEffect, FunctionComponent } from "react";
import { motion, useMotionValue, AnimatePresence } from "motion/react";

interface Props {
  src: string; // Image source
}

export const CaptionImage: FunctionComponent<Props> = ({ src }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom with wheel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const newScale = Math.min(5, Math.max(1, scale.get() - e.deltaY * 0.001));
      scale.set(newScale);
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [scale]);

  return (
    <div>
      <button onClick={() => setIsFullscreen(true)}>🔍</button>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            ref={containerRef}
            className="fullscreen-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              background: "rgba(0, 0, 0, 0.9)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <motion.img
              src={src}
              alt="Zoomable"
              drag
              dragConstraints={{
                top: -1000,
                bottom: 1000,
                left: -1000,
                right: 1000,
              }}
              style={{
                x,
                y,
                scale,
                cursor: "grab",
                touchAction: "none",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
              whileTap={{ cursor: "grabbing" }}
            />

            <button
              onClick={() => {
                x.set(0);
                y.set(0);
                scale.set(1);
                setIsFullscreen(false);
              }}
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
