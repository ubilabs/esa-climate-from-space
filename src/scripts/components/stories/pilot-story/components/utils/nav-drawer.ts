import {RefObject} from 'react';

/**
 * Calculates the initial snap point for the mobile drawer based on the height of the handler element and the window height.
 * @param handlerRef - The reference to the handler element.
 * @returns The initial snap point value.
 */
export function getSnapPoint(handlerRef: HTMLDivElement | null) {
  if (!window.innerHeight || !handlerRef) {
    return 0.1;
  }

  const snapPoint = handlerRef.clientHeight / window.innerHeight;

  return snapPoint;
}

export const updateIndicatorPosition = (
  indicationRef: RefObject<HTMLElement>,
  length: number,
  selectedChapterIndex: number,
  progress: number
) => {
  const progressIndicatorHeight = indicationRef.current?.clientHeight;

  if (progressIndicatorHeight && length) {
    const indicatorYOffsetInPx =
      (progressIndicatorHeight / (length + 1)) * selectedChapterIndex +
      (progressIndicatorHeight / (length + 1)) * progress;

    const indicatorYOffsetInPercent = `${
      (indicatorYOffsetInPx / progressIndicatorHeight) * 100
    }%`;

    indicationRef.current?.style.setProperty(
      '--indicator-y-offset',
      indicatorYOffsetInPercent
    );
  }
};
