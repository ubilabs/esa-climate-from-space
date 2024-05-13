import React, {useEffect, useMemo, useState} from 'react';

import {Parallax} from 'react-scroll-parallax';
import {useSwipeable} from 'react-swipeable';

import SatelliteElement from '../satellite-element/satellite-element';

import {useScreenSize} from '../../../../../hooks/use-screen-size';

import {SatelliteNames} from '../../types/globe';

import styles from './satellite-carousel.module.styl';

const satellitesByName = {
  [SatelliteNames['SENTINEL-1']]: {
    label: 'Sentinel-1',
    explanation:
      'Sentinel-1 is a satellite that provides radar images of Earth. It is used to monitor the environment, including methane emissions.'
  },
  [SatelliteNames['SENTINEL-2']]: {
    label: 'Sentinel-2',
    explanation:
      'Sentinel-2 is a satellite that provides optical images of Earth. It is used to monitor the environment, including methane emissions.'
  },
  [SatelliteNames['SENTINEL-3']]: {
    label: 'Sentinel-3',
    explanation:
      'Sentinel-3 is a satellite that provides images of Earth’s oceans and land. It is used to monitor the environment, including methane emissions.'
  }
} as const;

const SatelliteCarousel = () => {
  const [selectedIconIndex, setSelectedSourceIndex] = useState(0);

  const {isMobile} = useScreenSize();

  const satellites = Object.entries(satellitesByName).map(([key, value]) => ({
    key,
    value
  }));

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const diameter = useMemo(() => windowHeight * 0.8, [windowHeight]);

  const radius = useMemo(() => diameter / 2, [diameter]);

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
