import { useLayoutEffect, useState } from 'react';

export const useGlobeDimensions = (globeRef: HTMLElement) => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (!globeRef) {
      return;
    }

    // Get the current width of the container
    const updateHeight = () => {
      const rect = globeRef.getBoundingClientRect();
      const { height, width } = rect;

      setWidth(width);
      setHeight(height);
    };
    // Set height initially
    updateHeight();

    // Update height on resize
  }, [globeRef]);

  return { width, height };
};

