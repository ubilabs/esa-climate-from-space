import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { PanInfo } from "motion/react";

import { useDesktopWheelNavigation } from "./use-desktop-wheel-navigation";
import { useGlobalKeyboardNavigation } from "./use-global-keyboard-navigation";
import { useMobileMomentumNav } from "../libs/use-mobile-momentum-nav";

interface UseNavigationControlsOptions {
  itemCount: number;
  initialIndex: number;
  isMobile: boolean;
  onSyncPreviewValue: (value: number) => void;
  onAnimateToCurrentIndex?: (currentIndex: number) => VoidFunction | void;
  onDesktopGestureStart?: () => void;
  onDesktopGestureEnd?: (currentIndex: number) => void;
  onMobilePanSessionStart?: () => void;
  onMobilePanEnd?: (currentIndex: number) => void;
}

interface UseNavigationControlsResult {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  previewIndex: number;
  listRef: RefObject<HTMLUListElement | null>;
  selectedLinkRef: RefObject<HTMLAnchorElement | null>;
  stepPx: number;
  handleWheel: (event: React.WheelEvent<HTMLElement>) => void;
  panHandlers: {
    onPanSessionStart: () => void;
    onPan: (_event: PointerEvent, info: PanInfo) => void;
    onPanEnd: (_event: PointerEvent, info: PanInfo) => void;
  };
}

export const useNavigationControls = ({
  itemCount,
  initialIndex,
  isMobile,
  onSyncPreviewValue,
  onAnimateToCurrentIndex,
  onDesktopGestureStart,
  onDesktopGestureEnd,
  onMobilePanSessionStart,
  onMobilePanEnd,
}: UseNavigationControlsOptions): UseNavigationControlsResult => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [previewIndex, setPreviewIndex] = useState(initialIndex);
  const listRef = useRef<HTMLUListElement | null>(null);
  const selectedLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [stepPx, setStepPx] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when the initial index changes
    setCurrentIndex(initialIndex);
    setPreviewIndex(initialIndex);
  }, [initialIndex]);

  const { index: dragIndex, panHandlers: mobilePanHandlers } =
    useMobileMomentumNav({
      itemCount,
      initialIndex: currentIndex,
      stepPx,
      infinite: false,
      isEnabled: isMobile,
      onIndexChange: setCurrentIndex,
    });

  const moveIndex = (direction: -1 | 1) => {
    setCurrentIndex((previousIndex) => {
      const nextIndex = Math.min(
        itemCount - 1,
        Math.max(0, previousIndex + direction),
      );

      if (nextIndex !== previousIndex) {
        setPreviewIndex(nextIndex);
      }

      return nextIndex;
    });
  };

  useGlobalKeyboardNavigation({
    enabled: !isMobile && itemCount > 1,
    onPrevious: () => moveIndex(-1),
    onNext: () => moveIndex(1),
    onActivate: () => {
      selectedLinkRef.current?.click();
    },
  });

  const {
    handleWheel,
    previewIndex: desktopPreviewIndex,
    isInteracting: isDesktopInteracting,
  } = useDesktopWheelNavigation({
    enabled: !isMobile,
    currentIndex,
    itemCount,
    stepPx,
    onIndexChange: (nextIndex) => {
      setPreviewIndex(nextIndex);
      setCurrentIndex(nextIndex);
    },
    onGestureStart: onDesktopGestureStart,
    onGestureEnd: onDesktopGestureEnd,
  });

  useLayoutEffect(() => {
    if (!listRef.current || itemCount <= 1) {
      return;
    }

    const measureStep = () => {
      const items = Array.from(
        listRef.current?.querySelectorAll<HTMLLIElement>("li[data-index]") ?? [],
      );

      if (items.length <= 1) {
        return;
      }

      const activeItemIndex = Math.min(currentIndex, items.length - 2);
      const currentItem = items[activeItemIndex];
      const nextItem = items[activeItemIndex + 1];

      if (!currentItem || !nextItem) {
        return;
      }

      const currentTop = currentItem.getBoundingClientRect().top;
      const nextTop = nextItem.getBoundingClientRect().top;
      const nextStep = Math.abs(nextTop - currentTop);

      if (nextStep > 0) {
        setStepPx(nextStep);
      }
    };

    measureStep();
    window.addEventListener("resize", measureStep);

    return () => {
      window.removeEventListener("resize", measureStep);
    };
  }, [currentIndex, itemCount]);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- preview state mirrors the current index during desktop navigation
    setPreviewIndex(currentIndex);

    return onAnimateToCurrentIndex?.(currentIndex);
  }, [currentIndex, isMobile, onAnimateToCurrentIndex]);

  useEffect(() => {
    if (isMobile || !isDesktopInteracting) {
      return;
    }

    const unsubscribe = desktopPreviewIndex.on("change", (value) => {
      onSyncPreviewValue(value);
      setPreviewIndex(Math.round(value));
    });

    const nextIndex = desktopPreviewIndex.get();
    onSyncPreviewValue(nextIndex);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- preview state mirrors the animated motion value
    setPreviewIndex(Math.round(nextIndex));

    return unsubscribe;
  }, [
    desktopPreviewIndex,
    isDesktopInteracting,
    isMobile,
    onSyncPreviewValue,
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- preview state mirrors the committed index
    setPreviewIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    const unsubscribe = dragIndex.on("change", (value) => {
      onSyncPreviewValue(value);
      setPreviewIndex(Math.round(value));
    });

    const nextIndex = dragIndex.get();
    onSyncPreviewValue(nextIndex);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- preview state mirrors the drag motion value
    setPreviewIndex(Math.round(nextIndex));

    return unsubscribe;
  }, [dragIndex, isMobile, onSyncPreviewValue]);

  return {
    currentIndex,
    setCurrentIndex,
    previewIndex,
    listRef,
    selectedLinkRef,
    stepPx,
    handleWheel,
    panHandlers: {
      onPanSessionStart: () => {
        if (isMobile) {
          onMobilePanSessionStart?.();
        }

        mobilePanHandlers.onPanSessionStart();
      },
      onPan: mobilePanHandlers.onPan,
      onPanEnd: (event, info) => {
        mobilePanHandlers.onPanEnd(event, info);

        if (isMobile) {
          onMobilePanEnd?.(Math.round(dragIndex.get()));
        }
      },
    },
  };
};
