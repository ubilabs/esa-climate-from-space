import { useLayoutEffect, useState, useEffect } from "react";

export const useGlobeDimensions = (globeRef: HTMLElement) => {

  useLayoutEffect(() => {
    if (!globeRef) {
      return;
    }

    // Get the current width of the container
    const updateHeight = () => {
      const width = globeRef.offsetWidth;
      const height = globeRef.offsetHeight;
      console.log("height", height)

      const ratio = width/ height;

      globeRef.style.height = `${height + 50 }px`

      //if (ratio > 0.6) {
      //  globeRef.style.marginTop = `-${height / 10}px`;
      //} else {
      //  globeRef.style.height = `${height * 0.75}px`;
      //  globeRef.style.marginTop = `-${height / 14}px`;
      //}
    };

    // Set height initially
    updateHeight();

    // Update height on resize
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(globeRef);

    // Cleanup
    return () => {
      if (globeRef) {
        resizeObserver.unobserve(globeRef);
      }
      resizeObserver.disconnect();
    };
  }, [globeRef]);

};
