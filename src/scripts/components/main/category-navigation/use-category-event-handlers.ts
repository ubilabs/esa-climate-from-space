import { useState } from "react";
import { HAS_USER_INTERACTED } from "./category-navigation";

export const useCategoryTouchHandlers = () => {
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // The index of the current category
  const [currentTouchIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  // Handle touch events
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
      const nextIndex = currentTouchIndex + direction;

      setCurrentIndex(nextIndex);
      setTouchStart(null);
      setIsRotating(true);

      // Set a local state userHasInteracted to true
      localStorage.setItem(HAS_USER_INTERACTED, "true");
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setIsRotating(false);
  };
  return {
    isRotating,
    currentTouchIndex,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

export const useCategoryScrollHandlers = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [scrollAccumulator, setScrollAccumulator] = useState(0);
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [currentScrollIndex, setCurrentIndex] = useState(0);

  const handleScroll = (e: React.WheelEvent) => {
    // Don't call preventDefault directly as it may not work with passive event listeners
    if (e.cancelable) {
      e.preventDefault();
    }

    // Get the current time to throttle scroll events
    const now = Date.now();

    // Return if we're still processing the last scroll event (throttling)
    if (now - lastScrollTime < 100) {
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
      const direction = newScrollAccumulator > 0 ? -1 : 1;

      // Update the current index
      const nextIndex = currentScrollIndex + direction;
      setCurrentIndex(nextIndex);

      // Reset the accumulator
      setScrollAccumulator(0);

      // Set rotation state for visual feedback
      setIsRotating(true);

      // Mark that user has interacted with the wheel
      localStorage.setItem(HAS_USER_INTERACTED, "true");

      // Reset rotation state after animation completes
      setTimeout(() => setIsRotating(false), 300);
    }
  };
  return {
    handleScroll,
    currentScrollIndex,
  };
};
