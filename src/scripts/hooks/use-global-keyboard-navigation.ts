import { useEffect, useRef } from "react";

interface UseGlobalKeyboardNavigationOptions {
  enabled: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onActivate?: () => void;
}

const isIgnoredTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest(
      "input, textarea, select, button, a[href], [contenteditable='true']",
    ),
  );
};

export const useGlobalKeyboardNavigation = ({
  enabled,
  onPrevious,
  onNext,
  onActivate,
}: UseGlobalKeyboardNavigationOptions): void => {
  const callbacksRef = useRef({
    onPrevious,
    onNext,
    onActivate,
  });

  useEffect(() => {
    callbacksRef.current = {
      onPrevious,
      onNext,
      onActivate,
    };
  }, [onActivate, onNext, onPrevious]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isIgnoredTarget(event.target)) {
        return;
      }

      if (
        event.key !== "ArrowUp" &&
        event.key !== "ArrowDown" &&
        event.key !== "Enter"
      ) {
        return;
      }

      event.preventDefault();

      if (event.key === "ArrowUp") {
        callbacksRef.current.onPrevious();
        return;
      }

      if (event.key === "ArrowDown") {
        callbacksRef.current.onNext();
        return;
      }

      callbacksRef.current.onActivate?.();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);
};
