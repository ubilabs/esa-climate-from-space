import { Dispatch, SetStateAction, useCallback, useRef } from "react";
import { useGesture, Vector2 } from "@use-gesture/react";

import { Lethargy } from "lethargy";

const clamp = (value: number, min: number, max: number): number => {
  // Wrap the value around if it goes below the minimum or above the maximum
  if (value < min) {
    return max;
  }
  if (value > max) {
    return min;
  }
  return value;
};

export const useNavGestures = (
  maxIndex: number,
  setCurrentIndex: Dispatch<SetStateAction<number>>,
  setLastUserInteraction: Dispatch<SetStateAction<number>>,
  direction: "x" | "y" = "x",
) => {
  const slides = Array.from({ length: maxIndex }, (_, index) => index);
  const lethargy = useRef(new Lethargy());

  const handleWheel = useCallback(
    ({
      event,
      last,
      memo: wait = false,
    }: {
      event: WheelEvent;
      last: boolean;
      memo?: boolean;
    }) => {
      if (!last) {
        const s = lethargy.current.check(event);
        if (s) {
          if (!wait) {
            setCurrentIndex((i) => clamp(i - s, 0, slides.length - 1));
            setLastUserInteraction(Date.now());
            return true;
          }
        } else {
          return false;
        }
      }
    },
    [setCurrentIndex, setLastUserInteraction, slides.length],
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
          setCurrentIndex((i) => clamp(i + xDir, 0, slides.length - 1));
        } else {
          setCurrentIndex((i) => clamp(i - yDir, 0, slides.length - 1));
        }
        setLastUserInteraction(Date.now());
        cancel();
      }
    },
    [direction, setCurrentIndex, setLastUserInteraction, slides.length],
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
