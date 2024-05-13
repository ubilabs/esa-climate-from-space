import React, {useEffect, useState} from 'react';
import {useSwipeable} from 'react-swipeable';

import styles from './pilot-carousel.module.styl';

import {MethaneSources, methaneSources} from '../../types/globe';
import {MethaneSourcesIcon} from '../icons/methane-sources-icon/methane-source-icon';
import {useScreenSize} from '../../../../../hooks/use-screen-size';
import SwipeIcon from '../icons/swipe-icon/swipe-icon';

const PilotCarousel = () => {
  const sources = Object.entries(methaneSources).map(([key, value]) => ({
    key,
    value
  }));

  const {isMobile, isDesktop} = useScreenSize();

  const sourcesLength = isDesktop ? 5 : 3;
  const [selectedIconIndex, setSelectedSourceIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setSelectedSourceIndex((selectedIconIndex + 1) % sourcesLength),
    onSwipedRight: () =>
      setSelectedSourceIndex(
        (selectedIconIndex - 1 + sourcesLength) % sourcesLength
      )
  });

  function findY(r: number, x: number) {
    const h = 0; // x-coordinate of the circle's center
    const k = 0; // y-coordinate of the circle's center

    const insideSqrt = r * r - (x - h) * (x - h);
    if (insideSqrt < 0) {
      // The given x-coordinate does not intersect the circle.
      return null;
    }
    const sqrtVal = Math.sqrt(insideSqrt);
    const yValues = [k + sqrtVal, k - sqrtVal];
    return yValues[1];
  }

  const diameter = windowWidth;

  const radius = diameter / 2;
  const clipHeight = ((isMobile ? 10 : 20) / 100) * diameter;

  return (
    <div className={styles.carouselWrapper}>
      <h1>Some of the primary sources include:</h1>
      <legend>
        <span>Anthrophogenic</span>
        <span>Natural</span>
        <span>Anthrophogenic and Natural</span>
      </legend>

      <div className={styles.explanation}>
        {sources[selectedIconIndex].value.explanation}
      </div>
      <div {...handlers} className={styles.carousel}>
        {sources.map((_, i) => {
          const iconIndex =
            (selectedIconIndex -
              Math.floor(sourcesLength / 2) +
              i +
              sourcesLength) %
            sourcesLength;

          const diff = Math.abs(i - Math.floor(sourcesLength / 2));

          const x = (windowWidth / sourcesLength) * diff; // the given x-coordinate
          const yValues = findY(radius, x);

          const yValue = (yValues && yValues + radius) || 0;

          const isSelected = iconIndex === selectedIconIndex;

          if ((isMobile && diff > 1) || (isDesktop && diff > 2)) {
            return null;
          }

          return (
            <MethaneSourcesIcon
              onClick={() => setSelectedSourceIndex(iconIndex)}
              yValue={yValue}
              key={iconIndex}
              source={sources[iconIndex].key as MethaneSources}
              percentage={sources[iconIndex].value.percentageOfTotalEmission}
              sourceType={sources[iconIndex].value.type}
              isSelected={isSelected}
            />
          );
        })}
        <svg
          className={styles.curveLine}
          viewBox={`0 0 ${diameter} ${diameter}`}>
          <defs>
            <clipPath id="halfClip">
              <rect x="0" y="0" width={diameter} height={clipHeight} />
            </clipPath>
          </defs>
          <circle
            opacity="0.4"
            cx={radius}
            cy={radius}
            r={radius}
            stroke="rgba(63, 108, 125, 1)"
            fill="none"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="5.5"
            clipPath="url(#halfClip)"></circle>
        </svg>
        {isMobile && <SwipeIcon />}
      </div>
    </div>
  );
};

export default PilotCarousel;
