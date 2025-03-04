import { useCallback, useEffect, useRef, useState } from "react";
import { throttle } from "lodash";


export const useContentTouchHandlers = (
  currentIndex: number,
  setCurrentIndex: (index: number) => void,
  numOfItems: number, // Ensures we stay within bounds
) => {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  // Save the current index value in a ref to prevent it from resetting
  const currentIndexRef = useRef(currentIndex);

  // Update the ref whenever currentIndex changes
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) {
      setTouchStartY(e.touches[0].clientY);
      return;
    }

    const touchDelta = e.touches[0].clientY - touchStartY;

    // For content navigation, max should be number of items minus 1
    const maxIndex = Math.floor(numOfItems / 2);
    const minIdex = Math.floor(( numOfItems -1 )/ 2) * -1;

    const itemHeight = 32; // Height of each item in pixels
    const sensitivity = 0.5; // Adjust this to control movement sensitivity
    const threshold = itemHeight * sensitivity; // Minimum movement required
    if (Math.abs(touchDelta) > threshold) {
      // Determine direction based on touch movement
      const direction = touchDelta > 0 ? -1 : 1;

      // Use the ref value to ensure we're always working with the latest index value
      let newIndex = currentIndexRef.current + direction;

      // Clamp the value between min and max
      // Clamp the value between min and max using Math.min and Math.max
      newIndex = Math.max(Math.min(newIndex, maxIndex), minIdex);

      // Set the new index
      setCurrentIndex(newIndex);
      // Also update our ref
      currentIndexRef.current = newIndex;
      setTouchStartY(e.touches[0].clientY); // Reset for smooth transition
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };

  return {
    handleTouchMove,
    handleTouchEnd,
  };
};


export const useContentScrollHandlers = (
  currentIndex: number,
  setCurrentIndex: (index: number) => void,
) => {
  const wheelTimeoutRef = useRef<number | null>(null);
  const lastWheelTimeRef = useRef<number>(0);
  // Use a ref to keep track of the current index to prevent resets
  const currentIndexRef = useRef<number>(currentIndex);

  // Update the ref whenever the provided currentIndex changes
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const throttledHandleWheel = useCallback(
    throttle((e: React.WheelEvent) => {
      // prevent default browser scrolling behavior
      e.preventDefault();

      // if we already have a pending scroll action, ignore this one
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);

        return;
      }

      const now = Date.now();
      const timesincelastwheel = now - lastWheelTimeRef.current;

      // throttle wheel events
      if (timesincelastwheel < 300) {
        // 300ms throttle time
        //        return;
      }

      lastWheelTimeRef.current = now;

      // determine scroll direction
      const direction = e.deltaY > 0 ? -1 : 1;

      // Use the latest index from ref and apply the direction
      const newIndex = currentIndexRef.current + direction;

      // Update both the state and our ref
      setCurrentIndex(newIndex);
      currentIndexRef.current = newIndex;

      // set a timeout to reset the delta and allow another scroll
    }, 500),
    [],
  );

  useEffect(() => {
    wheelTimeoutRef.current = window.setTimeout(() => {

      wheelTimeoutRef.current = null;
    }, 300); // Longer delay to ensure complete animation before accepting another scroll
  }, [currentIndex]);

  // Clean up timeout when component unmounts
  useEffect(() => {
    return () => {
      if (wheelTimeoutRef.current) {
        window.clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, []);

  return {
    handleWheel: throttledHandleWheel,
  };
};
