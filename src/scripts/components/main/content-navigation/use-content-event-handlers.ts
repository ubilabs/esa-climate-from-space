import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const ITEM_HEIGHT = 32; // Height of each item in pixels

const TOUCH_SENSITIVITY = 2; // Adjust this to control movement sensitivity

// Calculate the bounds for content navigation
const calculateNavigationBounds = (itemCount: number) => {
  const maxIndex = itemCount - 1;
  const minIndex = 0;

  return { maxIndex, minIndex };
};

export const useContentTouchHandlers = (
  currentIndex: number,
  setCurrentIndex: Dispatch<SetStateAction<number>>,
  entryCount: number, // Ensures we stay within bounds
  setLastUserInteractionTime: Dispatch<SetStateAction<number>>,
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

    // Get the bounds from the utility function
    const { maxIndex, minIndex } = calculateNavigationBounds(entryCount);

    const threshold = ITEM_HEIGHT * TOUCH_SENSITIVITY; // Minimum movement required
    if (Math.abs(touchDelta) > threshold) {
      // Determine direction based on touch movement
      const direction = touchDelta < 0 ? 1 : -1;

      // Use the ref value to ensure we're always working with the latest index value
      let newIndex = currentIndexRef.current + direction;

      // Clamp the value between min and max using Math.min and Math.max
      newIndex = Math.max(Math.min(newIndex, maxIndex), minIndex);
      // Set the new index
      setCurrentIndex(newIndex);
      // Also update our ref
      currentIndexRef.current = newIndex;
      setTouchStartY(e.touches[0].clientY); // Reset for smooth transition
      setLastUserInteractionTime(Date.now());
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
  setCurrentIndex: Dispatch<SetStateAction<number>>,
  entryCount: number, // Total number of items
  setLastUserInteractionTime: Dispatch<SetStateAction<number>>,
) => {
  const isScrollingRef = useRef(false);

  const { maxIndex, minIndex } = calculateNavigationBounds(entryCount);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (isScrollingRef.current) return; // Prevents excessive triggering
      isScrollingRef.current = true;

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 200); // Adjust delay for smooth responsiveness

      const direction = e.deltaY < 0 ? -1 : 1; // Scroll down → next, Scroll up → previous

      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + direction;
        setLastUserInteractionTime(Date.now());
        return Math.max(minIndex, Math.min(newIndex, maxIndex)); // Keep within bounds
      });
    },
    [setCurrentIndex, minIndex, maxIndex, setLastUserInteractionTime]
  );

  return {
    handleWheel,
  };
};
