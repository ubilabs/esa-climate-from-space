import { useEffect, useRef } from "react";
import { WheelEvent as ReactWheelEvent } from "react";

const DESKTOP_WHEEL_STEP_THRESHOLD = 80;
const DESKTOP_WHEEL_IDLE_MS = 140;
const DESKTOP_WHEEL_NEW_GESTURE_DELTA = 24;
const DESKTOP_WHEEL_RETRIGGER_MS = 90;

interface UseDesktopWheelNavigationOptions {
  enabled: boolean;
  currentIndex: number;
  itemCount: number;
  onIndexChange: (nextIndex: number) => void;
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

export const useDesktopWheelNavigation = ({
  enabled,
  currentIndex,
  itemCount,
  onIndexChange,
}: UseDesktopWheelNavigationOptions) => {
  const wheelDeltaRef = useRef(0);
  const wheelLockedRef = useRef(false);
  const lastWheelTriggerTimeRef = useRef(0);
  const wheelIdleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      wheelLockedRef.current = false;
      wheelDeltaRef.current = 0;
      wheelIdleTimeoutRef.current = null;
    }, DESKTOP_WHEEL_IDLE_MS);
  };

  const handleWheel = (event: ReactWheelEvent<HTMLElement>) => {
    if (!enabled || itemCount <= 1) {
      return;
    }

    const now = performance.now();

    event.preventDefault();
    refreshWheelIdle();

    if (wheelLockedRef.current) {
      const isFreshGesture =
        Math.abs(event.deltaY) >= DESKTOP_WHEEL_NEW_GESTURE_DELTA &&
        now - lastWheelTriggerTimeRef.current >= DESKTOP_WHEEL_RETRIGGER_MS;

      if (!isFreshGesture) {
        return;
      }

      wheelLockedRef.current = false;
      wheelDeltaRef.current = 0;
    }

    wheelDeltaRef.current += event.deltaY;

    if (Math.abs(wheelDeltaRef.current) < DESKTOP_WHEEL_STEP_THRESHOLD) {
      return;
    }

    wheelLockedRef.current = true;
    lastWheelTriggerTimeRef.current = now;

    const nextIndex = clamp(
      currentIndex + Math.sign(wheelDeltaRef.current),
      0,
      itemCount - 1,
    );

    wheelDeltaRef.current = 0;

    if (nextIndex !== currentIndex) {
      onIndexChange(nextIndex);
    }
  };

  return { handleWheel };
};
