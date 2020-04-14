import {useEffect, useState} from 'react';

export const useMouseMove = () => {
  const [mouseMove, setMouseMove] = useState(true);

  useEffect(() => {
    let timer = 0;
    const handleMouseMove = () => {
      setMouseMove(true);
      timer = window.setTimeout(() => setMouseMove(false), 5000);
    };
    window.addEventListener('mousemove', handleMouseMove);
    const cleanUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
    return cleanUp;
  }, []);
  return mouseMove;
};
