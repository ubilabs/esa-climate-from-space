import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

const MOBILE_WIDTH = 768;
const DESKTOP_WIDTH = 1024;

// debounce the time update
const DELAY = 500;

export function useScreenSize() {
  const [dimensions, setDimensions] = useState({
    screenHeight: Math.floor(window.innerHeight),
    screenWidth: Math.floor(window.innerWidth),
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_WIDTH);
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= DESKTOP_WIDTH,
  );

  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  useEffect(() => {
    const handleResize = debounce(() => {
      setDimensions({
        screenHeight: Math.floor(window.innerHeight),
        screenWidth: Math.floor(window.innerWidth),
      });
      // Make sure this is the same value as defined in in variables.css
      setIsMobile(window.innerWidth < MOBILE_WIDTH);
      setIsDesktop(window.innerWidth >= DESKTOP_WIDTH);
    }, DELAY);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel();
    };
  }, []);

  return {
    screenHeight: dimensions.screenHeight,
    screenWidth: dimensions.screenWidth,
    isMobile,
    isTouchDevice,
    isDesktop,
  };
}
