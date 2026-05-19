import { useEffect, useRef } from "react";
import { animate, MotionValue, PanInfo, useMotionValue } from "motion/react";

const MOMENTUM_FACTOR = 24;
const MIN_SWIPE_VELOCITY = 0.6;
const MIN_SWIPE_DISTANCE_PX = 18;
const MAX_RELEASE_STEPS = 2;
const MIN_DRAG_DISTANCE_PX = 10;
const DRAG_RESISTANCE = 1.35;
const DRAG_SNAP_DURATION = 0.22;
const EXTERNAL_SYNC_EPSILON = 0.001;
const MAX_DRAG_STEPS_FOR_SWIPE = 0.75;

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

const wrap = (value: number, max: number): number => {
  if (max <= 0) {
    return 0;
  }

  return ((value % max) + max) % max;
};

const normalizeIndex = (
  value: number,
  itemCount: number,
  infinite: boolean,
): number => {
  if (itemCount <= 0) {
    return 0;
  }

  return infinite ? wrap(value, itemCount) : clamp(value, 0, itemCount - 1);
};

const applyDragResistance = (offset: number, stepPx: number): number => {
  const dragThreshold = Math.min(MIN_DRAG_DISTANCE_PX, stepPx * 0.2);

  if (Math.abs(offset) <= dragThreshold) {
    return 0;
  }

  return (
    Math.sign(offset) *
    ((Math.abs(offset) - dragThreshold) / DRAG_RESISTANCE)
  );
};

const isSwipeGesture = (
  info: PanInfo,
  stepPx: number,
  draggedSteps: number,
): boolean => {
  if (Math.abs(info.velocity.y) < MIN_SWIPE_VELOCITY) {
    return false;
  }

  if (Math.abs(info.offset.y) < MIN_SWIPE_DISTANCE_PX) {
    return false;
  }

  return draggedSteps <= MAX_DRAG_STEPS_FOR_SWIPE;
};

interface UseMobileMomentumNavProps {
  itemCount: number;
  initialIndex: number;
  stepPx: number;
  infinite?: boolean;
  isEnabled?: boolean;
  onIndexChange?: (index: number) => void;
}

interface UseMobileMomentumNavResult {
  index: MotionValue<number>;
  panHandlers: {
    onPanSessionStart: () => void;
    onPan: (_event: PointerEvent, info: PanInfo) => void;
    onPanEnd: (_event: PointerEvent, info: PanInfo) => void;
  };
}

export const useMobileMomentumNav = ({
  itemCount,
  initialIndex,
  stepPx,
  infinite = false,
  isEnabled = true,
  onIndexChange,
}: UseMobileMomentumNavProps): UseMobileMomentumNavResult => {
  const safeInitialIndex = normalizeIndex(initialIndex, itemCount, infinite);
  const index = useMotionValue(safeInitialIndex);
  const dragStartIndexRef = useRef(safeInitialIndex);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const lastNotifiedIndexRef = useRef(Math.round(safeInitialIndex));

  const stop = () => {
    animationRef.current?.stop();
    animationRef.current = null;
  };

  const finishAt = (nextIndex: number) => {
    dragStartIndexRef.current = nextIndex;
  };

  const commitIndex = (nextIndex: number) => {
    const committedIndex = normalizeIndex(Math.round(nextIndex), itemCount, infinite);

    if (committedIndex === lastNotifiedIndexRef.current) {
      return;
    }

    lastNotifiedIndexRef.current = committedIndex;
    onIndexChange?.(committedIndex);
  };

  const animateTo = (nextIndex: number, duration: number, ease: string) => {
    stop();
    commitIndex(nextIndex);
    animationRef.current = animate(index, nextIndex, {
      type: "tween",
      duration,
      ease,
      onComplete: () => {
        animationRef.current = null;
        finishAt(nextIndex);
      },
    });
  };

  const animateSwipeTo = (nextIndex: number, velocity: number) => {
    stop();
    commitIndex(nextIndex);
    animationRef.current = animate(index, nextIndex, {
      type: "spring",
      stiffness: 220,
      damping: 30,
      mass: 1,
      velocity: -velocity / stepPx,
      onComplete: () => {
        animationRef.current = null;
        finishAt(nextIndex);
      },
    });
  };

  const canDrag = isEnabled && itemCount > 1 && stepPx > 0;

  useEffect(() => {
    const normalizedInitial = normalizeIndex(initialIndex, itemCount, infinite);
    lastNotifiedIndexRef.current = normalizedInitial;

    if (
      Math.abs(index.get() - normalizedInitial) < EXTERNAL_SYNC_EPSILON ||
      normalizeIndex(Math.round(index.get()), itemCount, infinite) ===
        normalizedInitial
    ) {
      return;
    }

    stop();
    animationRef.current = animate(index, normalizedInitial, {
      type: "spring",
      stiffness: 420,
      damping: 42,
      mass: 0.8,
      onComplete: () => {
        animationRef.current = null;
        finishAt(normalizedInitial);
      },
    });
  }, [index, infinite, initialIndex, itemCount]);

  return {
    index,
    panHandlers: {
      onPanSessionStart: () => {
        if (!canDrag) {
          return;
        }

        stop();
        dragStartIndexRef.current = index.get();
      },
      onPan: (_event, info) => {
        if (!canDrag) {
          return;
        }

        const adjustedOffset = applyDragResistance(info.offset.y, stepPx);
        const nextIndex = normalizeIndex(
          dragStartIndexRef.current - adjustedOffset / stepPx,
          itemCount,
          infinite,
        );

        index.set(nextIndex);
      },
      onPanEnd: (_event, info) => {
        if (!canDrag) {
          return;
        }

        const currentIndex = index.get();
        const nearestIndex = Math.round(currentIndex);
        const draggedSteps = Math.abs(currentIndex - dragStartIndexRef.current);

        if (!isSwipeGesture(info, stepPx, draggedSteps)) {
          animateTo(
            normalizeIndex(nearestIndex, itemCount, infinite),
            DRAG_SNAP_DURATION,
            "easeOut",
          );
          return;
        }

        const releaseDelta = clamp(
          (info.velocity.y * MOMENTUM_FACTOR) / stepPx,
          -MAX_RELEASE_STEPS,
          MAX_RELEASE_STEPS,
        );
        const targetIndex = normalizeIndex(
          Math.round(currentIndex - releaseDelta),
          itemCount,
          infinite,
        );

        animateSwipeTo(targetIndex, info.velocity.y);
      },
    },
  };
};
