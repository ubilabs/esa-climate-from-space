import { useRef } from "react";

interface UseSwipeVerticalOptions {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeUpStarted?: () => void;
  onSwipeDownStarted?: () => void;
  threshold?: number; // Minimum swipe distance in px
  onTouchStartCallback?: () => void;
}

/**
 * A hook to detect vertical swipe gestures and trigger callbacks.
 * It distinguishes between the start of a swipe and the end of a swipe.
 */
export function useSwipeVertical({
  onSwipeUp,
  onSwipeDown,
  onSwipeUpStarted,
  onSwipeDownStarted,
  threshold = 50,
  onTouchStartCallback,
}: UseSwipeVerticalOptions & {}) {
  const touchStartY = useRef<number | null>(null);
  const hasSwipeStarted = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    hasSwipeStarted.current = false; // Reset on new touch
    onTouchStartCallback?.();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Fire "started" event only once per swipe gesture.
    if (touchStartY.current === null || hasSwipeStarted.current) {
      return;
    }

    const deltaY = touchStartY.current - e.touches[0].clientY;

    // A swipe is considered "started" as soon as there's any vertical movement.
    if (Math.abs(deltaY) > 0) {
      if (deltaY > 0) {
        onSwipeUpStarted?.();
      } else {
        onSwipeDownStarted?.();
      }
      hasSwipeStarted.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) {
      return;
    }

    const deltaY = touchStartY.current - e.changedTouches[0].clientY;

    // The final swipe action is only triggered if the swipe distance meets the threshold.
    if (Math.abs(deltaY) >= threshold) {
      if (deltaY > 0) {
        onSwipeUp?.();
      } else {
        onSwipeDown?.();
      }
    }

    // Reset for the next swipe action
    touchStartY.current = null;
    hasSwipeStarted.current = false;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
