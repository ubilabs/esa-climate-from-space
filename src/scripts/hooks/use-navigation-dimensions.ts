import { useLayoutEffect, useState, useEffect, useRef } from "react";

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

//       const ratio = widthRef.current / heightRef.current;
  //     console.log(ratio);

      // globeRef.style.height = `${Math.min(widthRef.current, heightRef.current)}px`;


      isSetRef.current = true;

      //if (ratio < 1) {
      //  // For narrow viewports
      //  const baseGrowthFactor = 1.3;
      //  const variableFactor = Math.min(0.6, widthRef.current / 2500) *
      //                        Math.log10(widthRef.current / 250 + 1);
      //  const growthFactor = baseGrowthFactor * (1 + variableFactor);
      //  const growth = widthRef.current * growthFactor;
      //
      //  globeRef.style.height = `${growth}px`;
      //} else {
      //  // For wide viewports
      //  const baseGrowthFactor = 1.0;
      //  const variableFactor = Math.min(0.2, widthRef.current / 3500) *
      //                        Math.log10(widthRef.current / 250 + 1);
      //  const growthFactor = baseGrowthFactor * (1 + variableFactor);
      //  const growth = Math.min(widthRef.current * growthFactor, height);
      //  globeRef.style.height = `${growth}px`;
      //}
    };

    // Set height initially
    updateHeight();

    // Update height on resize
  }, [globeRef]);

  return { width: widthRef.current, height: heightRef.current };
};
