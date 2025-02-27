import {useState, useEffect} from 'react';

export function useScreenSize() {
  const [dimensions, setDimensions] = useState({
    screenHeight: Math.floor(window.innerHeight),
    screenWidth: Math.floor(window.innerWidth)
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        screenHeight: Math.floor(window.innerHeight),
        screenWidth: Math.floor(window.innerWidth)
      });
      // Make sure this is the same value as defined in in variables.css
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {screenHeight: dimensions.screenHeight, screenWidth: dimensions.screenWidth, isMobile};
}
