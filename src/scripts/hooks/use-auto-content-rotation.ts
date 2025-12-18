import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { AUTO_ROTATE_INTERVAL, USER_INACTIVITY_TIMEOUT } from "../config/main";

export const useAutoRotate = ({
  lastUserInteractionTime,
  setCurrentIndex,
  itemsLength,
  isAnimationReady = true,
}: {
  lastUserInteractionTime: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  itemsLength: number;
  isAnimationReady?: boolean;
}) => {
  const [shouldAutoRotate, setShouldAutoRotate] =useState(false);

  const autoRotateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Handle user inactivity timeout
  useEffect(() => {
    const inactivityTimeout = setTimeout(() => {
      setShouldAutoRotate(true);
    }, USER_INACTIVITY_TIMEOUT);

    return () => {
      clearTimeout(inactivityTimeout);
      setShouldAutoRotate(false);
    };
  }, [lastUserInteractionTime]);

  // Handle auto-rotation logic
  useEffect(() => {
    if (isAnimationReady && shouldAutoRotate) {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
      }

      autoRotateIntervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % itemsLength);
      }, AUTO_ROTATE_INTERVAL);
    } else if (!shouldAutoRotate && autoRotateIntervalRef.current) {
      clearInterval(autoRotateIntervalRef.current);
      autoRotateIntervalRef.current = null;
    }

    return () => {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
        autoRotateIntervalRef.current = null;
      }
    };
  }, [isAnimationReady, shouldAutoRotate, itemsLength, setCurrentIndex]);
};

export default useAutoRotate;

