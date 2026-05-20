import { useEffect, useRef, useState } from "react";
import { WheelEvent as ReactWheelEvent } from "react";
import { MotionValue, useMotionValue } from "motion/react";

const DESKTOP_WHEEL_IDLE_MS = 140;
const LINE_HEIGHT_PX = 16;

interface UseDesktopWheelNavigationOptions {
  enabled: boolean;
  currentIndex: number;
  itemCount: number;
  stepPx: number;
  onIndexChange: (nextIndex: number) => void;
  onGestureStart?: () => void;
  onGestureEnd?: (committedIndex: number) => void;
}

interface UseDesktopWheelNavigationResult {
  handleWheel: (event: ReactWheelEvent<HTMLElement>) => void;
  previewIndex: MotionValue<number>;
  isInteracting: boolean;
}

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
};

const normalizeWheelDelta = (event: ReactWheelEvent<HTMLElement>): number => {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return event.deltaY * LINE_HEIGHT_PX;
  }

  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }

  return event.deltaY;
};

export const useDesktopWheelNavigation = ({
  enabled,
  currentIndex,
  itemCount,
  stepPx,
  onIndexChange,
  onGestureStart,
  onGestureEnd,
}: UseDesktopWheelNavigationOptions): UseDesktopWheelNavigationResult => {
  const previewIndex = useMotionValue(
    clamp(currentIndex, 0, Math.max(itemCount - 1, 0)),
  );
  const wheelIdleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInteractingRef = useRef(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    return () => {
      if (wheelIdleTimeoutRef.current) {
        clearTimeout(wheelIdleTimeoutRef.current);
      }
    };
  }, []);

  const refreshWheelIdle = () => {
    if (wheelIdleTimeoutRef.current) {
      clearTimeout(wheelIdleTimeoutRef.current);
    }

    wheelIdleTimeoutRef.current = setTimeout(() => {
      const committedIndex = clamp(
        Math.round(previewIndex.get()),
        0,
        itemCount - 1,
      );
      const hasIndexChanged = committedIndex !== currentIndex;

      isInteractingRef.current = false;
      setIsInteracting(false);
      wheelIdleTimeoutRef.current = null;

      onGestureEnd?.(committedIndex);

      if (hasIndexChanged) {
        onIndexChange(committedIndex);
        return;
      }

      previewIndex.set(committedIndex);
    }, DESKTOP_WHEEL_IDLE_MS);
  };

  useEffect(() => {
    const nextIndex = clamp(currentIndex, 0, Math.max(itemCount - 1, 0));

    if (isInteractingRef.current) {
      return;
    }

    previewIndex.set(nextIndex);
  }, [currentIndex, itemCount, previewIndex]);

  const handleWheel = (event: ReactWheelEvent<HTMLElement>) => {
    if (!enabled || itemCount <= 1 || stepPx <= 0) {
      return;
    }

    event.preventDefault();
    if (!isInteractingRef.current) {
      isInteractingRef.current = true;
      setIsInteracting(true);
      previewIndex.set(clamp(currentIndex, 0, itemCount - 1));
      onGestureStart?.();
    }

    const delta = normalizeWheelDelta(event);
    const nextIndex = clamp(
      previewIndex.get() + delta / stepPx,
      0,
      itemCount - 1,
    );

    previewIndex.set(nextIndex);
    refreshWheelIdle();
  };

  return { handleWheel, previewIndex, isInteracting };
};
