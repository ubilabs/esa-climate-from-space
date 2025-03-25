import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import config from "../../../config/main";

export const useCategoryTouchHandlers = (
  currentIndex: number,
  setCurrentIndex: Dispatch<SetStateAction<number>>,
  setHasUserInteracted: Dispatch<SetStateAction<number>>,
) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) {
      return;
    }

    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    if (Math.abs(diff) > 50) {
      // Remove modulo, allow continuous rotation
      const direction = diff > 0 ? -1 : 1;
      const nextIndex = currentIndex + direction;

      setCurrentIndex(nextIndex);
      setTouchStart(null);

      setHasUserInteracted(Date.now());
      // Set a local state userHasInteracted to true
      localStorage.setItem(config.localStorageHasUserInteractedKey, "true");
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

export const useCategoryScrollHandlers = (
  currentIndex: number,
  setCurrentIndex: (index: number) => void,
  setHasUserInteracted: Dispatch<SetStateAction<number>>,

) => {
  const [isRotating, setIsRotating] = useState(false);
  const [scrollAccumulator, setScrollAccumulator] = useState(0);
  const [lastScrollTime, setLastScrollTime] = useState(0);

  const handleScroll = useCallback(
    (e: React.WheelEvent) => {
      // Don't call preventDefault directly as it may not work with passive event listeners
      if (e.cancelable) {
        e.preventDefault();
      }

      // Get the current time to throttle scroll events
      const now = Date.now();

      // Return if we're still processing the last scroll event (throttling)
      if (now - lastScrollTime < 200) {
        return;
      }

      // Update last scroll time
      setLastScrollTime(now);

      // Get the scroll delta and accumulate it
      const delta = e.deltaY;

      // If we're currently rotating, don't accumulate more scroll
      // This ensures we only change the index once per scroll action
      if (isRotating) {
        return;
      }

      const newScrollAccumulator = scrollAccumulator + delta;
      setScrollAccumulator(newScrollAccumulator);

      // Define the threshold for changing categories (lowered from 150)
      const SCROLL_THRESHOLD = 50;

      // Check if we've crossed the threshold
      if (Math.abs(newScrollAccumulator) > SCROLL_THRESHOLD) {
        // Calculate direction (positive = down/right, negative = up/left)
        const direction = newScrollAccumulator > 0 ? 1 : -1;

        // Update the current index
        const nextIndex = currentIndex + direction;
        setCurrentIndex(nextIndex);

        // Reset the accumulator
        setScrollAccumulator(0);

        // Set rotation state for visual feedback
        setIsRotating(true);

        setHasUserInteracted(Date.now());
        // We want to avoid showing the scroll- or swipe indicator after the user has interacted
        // Therefore, we keep track of the user interaction with the navigation
        localStorage.setItem(config.localStorageHasUserInteractedKey, "true");

        // Reset rotation state after animation completes
        setTimeout(() => setIsRotating(false), 300);
      }
    },
    [
      currentIndex,
      isRotating,
      lastScrollTime,
      scrollAccumulator,
      setCurrentIndex,
      setHasUserInteracted,
      setIsRotating,
      setLastScrollTime,
      setScrollAccumulator,
    ],
  );

  // Add wheel event handler to document when the component mounts
  useEffect(() => {
    // Attach wheel event to document
    document.addEventListener(
      "wheel",
      handleScroll as unknown as EventListener,
      { passive: false },
    );

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener(
        "wheel",
        handleScroll as unknown as EventListener,
      );
    };
  }, [currentIndex, handleScroll]);
};
