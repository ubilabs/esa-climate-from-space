import {RefObject} from 'react';
import {dataIsTitleInView} from '../../config/main';

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
  progress: number,
  gap: number
) => {
  if (!indicationRef.current) {
    return;
  }
  indicationRef.current.setAttribute(dataIsTitleInView, 'false');

  const progressIndicatorHeight = indicationRef.current.clientHeight;

  // Get the circle radius from the CSS custom property
  // This is used to calculate the offset of the indicator
  // We want the indicator to start below the circle indication for the selected chapter intro
  const circleRadius = Number(
    window
      .getComputedStyle(indicationRef.current)
      .getPropertyValue('--circle-radius')
      .replace('px', '')
  );

  if (progressIndicatorHeight && length) {
    const indicatorYOffsetInPx =
      (progressIndicatorHeight / length) * selectedChapterIndex +
      (progressIndicatorHeight / length) * progress +
      (selectedChapterIndex * gap) / circleRadius;

    const indicatorYOffsetInPercent = `${
      (indicatorYOffsetInPx / progressIndicatorHeight) * 100
    }%`;

    indicationRef.current.style.setProperty(
      '--indicator-y-offset',
      indicatorYOffsetInPercent
    );
  }
};
