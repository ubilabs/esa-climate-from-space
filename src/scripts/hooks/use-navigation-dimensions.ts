import { useLayoutEffect, useRef } from "react";

export const useGlobeDimensions = (globeRef: HTMLElement) => {
  const widthRef = useRef<number>(0);
  const heightRef = useRef<number>(0);
  const isSetRef = useRef<boolean>(false);

  useLayoutEffect(() => {
    if (!globeRef) {
      return;
    }

    // Get the current width of the container
    const updateHeight = () => {
      const rect = globeRef.getBoundingClientRect();
      const { height, width } = rect;

      widthRef.current = width;
      heightRef.current = height;


      isSetRef.current = true;

    };
    // Set height initially
    updateHeight();

    // Update height on resize
  }, [globeRef]);

  return { width: widthRef.current, height: heightRef.current };
};
