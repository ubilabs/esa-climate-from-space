import { Dispatch, SetStateAction, useCallback, useRef } from "react";
import { useGesture, Vector2 } from "@use-gesture/react";

import { Lethargy } from "lethargy";

const clamp = (value: number, min: number, max: number): number => {
  // Clamps the value to be within the [min, max] range
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

const wrap = (value: number, min: number, max: number): number => {
  // Wrap the value around if it goes below the minimum or above the maximum
  if (value < min) {
    return max;
  }
  if (value > max) {
    return min;
  }
  return value;
};

const DEBOUNCE_MS = 600; // adjust to taste

export const useNavGestures = (
  maxIndex: number,
  setCurrentIndex: Dispatch<SetStateAction<number>>,
  setLastUserInteraction: Dispatch<SetStateAction<number>>,
  direction: "x" | "y" = "x",
  infinite = false,
) => {
  const lastWheelRef = useRef<number | null>(null);
  const slides = Array.from({ length: maxIndex }, (_, index) => index);
  const lethargy = useRef(new Lethargy());

  const clampFn = infinite ? wrap : clamp;

  const handleWheel = useCallback(
    ({ event, last }: { event: WheelEvent; last: boolean }) => {
      if (last) return;

      const s = lethargy.current.check(event);
      if (!s) return false;

      const now = Date.now();
      // store last trigger time in ref
      if (!lastWheelRef.current || now - lastWheelRef.current > DEBOUNCE_MS) {
        setCurrentIndex((i) => clampFn(i - s, 0, slides.length - 1));
        setLastUserInteraction(now);
        lastWheelRef.current = now;
        return true;
      }
      return false;
    },
    [clampFn, setCurrentIndex, setLastUserInteraction, slides.length],
  );
  const handleDrag = useCallback(
    ({
      active,
      movement: [mx, my],
      direction: [xDir, yDir],
      cancel,
    }: {
      active: boolean;
      movement: Vector2;
      direction: Vector2;
      cancel: () => void;
    }) => {
      const m = direction === "x" ? mx : my;
      if (active && Math.abs(m) < window.innerWidth / 3) {
        if (direction === "x") {
          setCurrentIndex((i) => clampFn(i + xDir, 0, slides.length - 1));
        } else {
          setCurrentIndex((i) => clampFn(i - yDir, 0, slides.length - 1));
        }
        setLastUserInteraction(Date.now());
        cancel();
      }
    },
    [
      clampFn,
      direction,
      setCurrentIndex,
      setLastUserInteraction,
      slides.length,
    ],
  );

  useGesture(
    {
      onWheel: handleWheel,
      onDrag: handleDrag,
    },
    {
      target: typeof window !== "undefined" ? window : undefined,
      wheel: {
        preventDefault: true,
        eventOptions: { passive: false },
        threshold: 50,
      },
      drag: {
        axis: direction,
        filterTaps: true,
      },
    },
  );
};
