import {useState, useEffect} from 'react';

const MOBILE_WIDTH = 768;

export function useScreenSize() {
  const [dimensions, setDimensions] = useState({
    screenHeight: Math.floor(window.innerHeight),
    screenWidth: Math.floor(window.innerWidth)
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_WIDTH);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        screenHeight: Math.floor(window.innerHeight),
        screenWidth: Math.floor(window.innerWidth)
      });
      // Make sure this is the same value as defined in in variables.css
      setIsMobile(window.innerWidth < MOBILE_WIDTH);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {screenHeight: dimensions.screenHeight, screenWidth: dimensions.screenWidth, isMobile};
}
