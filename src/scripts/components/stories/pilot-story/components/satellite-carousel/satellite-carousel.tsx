import React, {useEffect, useState} from 'react';

import {Parallax} from 'react-scroll-parallax';
import {useSwipeable} from 'react-swipeable';

import {satellitesByName} from '../../types/globe';
import SatelliteElement from '../satellite-element/satellite-element';

import {useScreenSize} from '../../../../../hooks/use-screen-size';

import styles from './satellite-carousel.module.styl';

const SatelliteCarousel = () => {
  const [selectedIconIndex, setSelectedSourceIndex] = useState(0);

  const {isMobile} = useScreenSize();

  const satellites = Object.entries(satellitesByName).map(([key, value]) => ({
    key,
    value
  }));

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const diameter = windowHeight * 0.8;

  const radius = diameter / 2;

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const numberOfSatellites = satellites.length;

  const handlers = useSwipeable({
    onSwipedUp: () =>
      setSelectedSourceIndex((selectedIconIndex + 1) % numberOfSatellites),
    onSwipedDown: () =>
      setSelectedSourceIndex(
        (selectedIconIndex - 1 + numberOfSatellites) % numberOfSatellites
      )
  });

  return (
    <div {...handlers} className={styles.carousel}>
      <Parallax
        speed={15}
        style={{marginBottom: isMobile ? '-240px' : ''}}
        className={styles.info}>
        3 most important satellites used by European Space Agency
      </Parallax>
      <div className={styles.satellitesContainer}>
        <Parallax className={styles.satellites}>
          {satellites.map((_, index) => {
            const iconIndex =
              (selectedIconIndex -
                Math.floor(numberOfSatellites / 2) +
                index +
                numberOfSatellites) %
              numberOfSatellites;

            const isSelected = iconIndex === selectedIconIndex;

            return (
              <SatelliteElement
                onClick={setSelectedSourceIndex}
                isSelected={isSelected}
                iconIndex={iconIndex}
                label={satellites[iconIndex].value.label}
                key={satellites[iconIndex].key}
                info={satellites[iconIndex].value.explanation}
              />
            );
          })}
        </Parallax>
        <div className={styles.curveLine}>
          <svg
            viewBox={`0 0 ${diameter} ${diameter}`}
            style={{height: `${diameter}px`}}>
            <ellipse
              opacity="0.4"
              cx={radius}
              cy={radius}
              rx={radius}
              ry={radius * 1.5}
              stroke="rgba(63, 108, 125, 1)"
              fill="none"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="5.5"></ellipse>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SatelliteCarousel;
