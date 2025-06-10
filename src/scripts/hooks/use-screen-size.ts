import { useState, useEffect } from "react";

const MOBILE_WIDTH = 768;
const DESKTOP_WIDTH = 1024;

export function useScreenSize() {
  const [dimensions, setDimensions] = useState({
    screenHeight: Math.floor(window.innerHeight),
    screenWidth: Math.floor(window.innerWidth),
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_WIDTH);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= DESKTOP_WIDTH);

  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        screenHeight: Math.floor(window.innerHeight),
        screenWidth: Math.floor(window.innerWidth),
      });
      // Make sure this is the same value as defined in in variables.css
      setIsMobile(window.innerWidth < MOBILE_WIDTH);
      setIsDesktop(window.innerWidth >= DESKTOP_WIDTH);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    screenHeight: dimensions.screenHeight,
    screenWidth: dimensions.screenWidth,
    isMobile,
    isTouchDevice,
    isDesktop,
  };
}
