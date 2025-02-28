import { useEffect, useRef, useState } from "react";

export const useContentTouchHandlers = (
  indexDelta: number,
  setIndexDelta: (delta: number) => void,
) => {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY) {
      setTouchStartY(e.touches[0].clientY);
      return;
    }

    const touchDelta = e.touches[0].clientY - touchStartY;

    const itemHeight = 32; // Height of each item in pixels
    const sensitivity = 0.5; // Adjust this to control movement sensitivity

    const delta = Math.round((touchDelta * sensitivity) / itemHeight);

    if (delta !== indexDelta) {
      setIndexDelta(delta);
      setTouchStartY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    console.log("touchStartY", touchStartY);
    setTouchStartY(null);
  };

  return {
    touchStartY,
    handleTouchEnd,
    handleTouchMove,
  };
};
export const useContentScrollHandlers = (
  indexDelta: number,
  setIndexDelta: (delta: number) => void,
) => {
  const wheelTimeoutRef = useRef<number | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    // Adjust scroll speed sensitivity
    const scrollDelta = e.deltaY > 0 ? -1 : 1;

    // Adjust this to control movement sensitivity
    const sensitivity = 1;

    const delta = scrollDelta * sensitivity;

    if (delta !== indexDelta) {
      setIndexDelta(delta);
    }

    // Clear any existing timeout
    if (wheelTimeoutRef.current) {
      window.clearTimeout(wheelTimeoutRef.current);
    }

    // Set a timeout to reset the indexDelta after a short period of inactivity
    wheelTimeoutRef.current = window.setTimeout(() => {
      setIndexDelta(0);
    }, 100);
  };

  // Clean up timeout when component unmounts
  useEffect(() => {
    return () => {
      if (wheelTimeoutRef.current) {
        window.clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, []);

  return {
    handleWheel,
  };
};
