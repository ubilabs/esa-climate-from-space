import {useEffect, useState} from 'react';

export const useMouseMove = () => {
  const [mouseMove, setMouseMove] = useState(true);

  useEffect(() => {
    let timer = 0;
    window.onmousemove = () => {
      setMouseMove(true);
      clearTimeout(timer);
      timer = window.setTimeout(() => setMouseMove(false), 5000);
    };
  }, []);
  return mouseMove;
};
