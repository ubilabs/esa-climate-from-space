import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const useContentTouchHandlers = (
  currentIndex: number,
  setCurrentIndex: Dispatch<SetStateAction<number>>,
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
    const minIdex = Math.floor((numOfItems - 1) / 2) * -1;

    const itemHeight = 32; // Height of each item in pixels
    const sensitivity = 2; // Adjust this to control movement sensitivity
    const threshold = itemHeight * sensitivity; // Minimum movement required
    if (Math.abs(touchDelta) > threshold) {
      // Determine direction based on touch movement
      const direction = touchDelta > 0 ? 1 : -1;

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
  setCurrentIndex: Dispatch<SetStateAction<number>>,
  numOfItems: number, // Total number of items
) => {
  const isScrollingRef = useRef(false);

  // Dynamically calculate min and max index
  const maxIndex = Math.floor(numOfItems / 2);
  const minIndex = Math.floor((numOfItems - 1) / 2) * -1;

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (isScrollingRef.current) return; // Prevents excessive triggering
      isScrollingRef.current = true;

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 200); // Adjust delay for smooth responsiveness

      const direction = e.deltaY > 0 ? -1 : 1; // Scroll down → next, Scroll up → previous

      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + direction;
        return Math.max(minIndex, Math.min(newIndex, maxIndex)); // Keep within bounds
      });
    },
    [setCurrentIndex, minIndex, maxIndex],
  );

  return {
    handleWheel,
  };
};
