import React, {FunctionComponent, LegacyRef, useEffect, useRef} from 'react';

import {LayerProps, WebGlGlobe} from '@ubilabs/esa-webgl-globe';

import {useParallax} from 'react-scroll-parallax';

import {GlobeMovementsPerChapter} from '../../types/globe';

import styles from './globe.module.styl';

const INITIAL_DISTANCE = 30_000_000;
const DISTANCE_INCREASEMENT_FACTOR = 0.02;

function extractTranslateValues(str: string): [number, number] {
  // Regular expression to match floating point numbers
  const regex = /[-+]?\d*\.\d+%?/g;
  const matches: RegExpMatchArray | null = str.match(regex);
  if (matches && matches.length >= 2) {
    // Extracted numbers from the string
    const num1: number = parseFloat(matches[0]);
    const num2: number = parseFloat(matches[1]);
    return [num1, num2];
  }
  return [0, 0];
}

function moveGlobe(
  progressPercent: number,
  moveBy: {x: number; y: number; z: number},
  formerMovements: {x: number; y: number; z: number},
  relativePosition: {x: number; y: number; z: number},
  globeContainer: HTMLDivElement,
  distanceRef: React.MutableRefObject<number>
) {
  // get the current globe position [x, y]
  const translate = extractTranslateValues(globeContainer.style.transform);

  // Change globe x/y-position
  const moveToX =
    relativePosition.x + formerMovements.x + progressPercent / (100 / moveBy.x);

  const moveToY =
    relativePosition.y + formerMovements.y + progressPercent / (100 / moveBy.y);

  globeContainer.style.transform = `translate(${
    // x-value has to be divided by 2 because globe left/right margin is -50%
    moveBy.x ? moveToX / 2 : translate[0]
  }%, ${moveBy.y ? moveToY : translate[1]}%)`;

  // Change globe z-position
  const formerMovementsDistance =
    INITIAL_DISTANCE * formerMovements.z * DISTANCE_INCREASEMENT_FACTOR;

  const positionDistance =
    INITIAL_DISTANCE * relativePosition.z * DISTANCE_INCREASEMENT_FACTOR;

  const movementDistance =
    INITIAL_DISTANCE *
    (progressPercent / 100) *
    moveBy.z *
    DISTANCE_INCREASEMENT_FACTOR;

  distanceRef.current =
    INITIAL_DISTANCE +
    positionDistance +
    formerMovementsDistance +
    movementDistance;
}

interface Props {
  relativePosition: {x: number; y: number; z: number};
  isSpinning: boolean;
  isVisible: boolean;
  globeMovements: GlobeMovementsPerChapter;
  children: React.ReactNode;
}

const Globe: FunctionComponent<Props> = ({
  relativePosition,
  isSpinning,
  isVisible,
  globeMovements,
  children
}) => {
  const parallax = useParallax({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef<number>(180);
  const distanceRef = useRef<number>(INITIAL_DISTANCE);
  const progressRef = useRef<number>(0);
  const [globe, setGlobe] = React.useState<WebGlGlobe | null>(null);

  useEffect(() => {
    if (containerRef.current && !globe) {
      // Latest timestamp: December 2021
      const timeIndex = 71;
      // @ts-ignore - injected via webpack's define plugin
      const version = INFO_VERSION;

      const newGlobe = new WebGlGlobe(containerRef.current, {
        layers: [
          {
            id: 'basemap',
            zIndex: 0,
            type: 'tile',
            maxZoom: 5,
            urlParameters: {},
            getUrl: ({x, y, zoom}) =>
              `https://storage.googleapis.com/esa-cfs-tiles/${version}/basemaps/land/${zoom}/${x}/${y}.png`
          } as LayerProps,
          {
            id: 'greenhouse.xch4',
            zIndex: 1,
            type: 'tile',
            maxZoom: 5,
            urlParameters: {},
            getUrl: ({x, y, zoom}) =>
              `https://storage.googleapis.com/esa-cfs-tiles/${version}/greenhouse.xch4/tiles/${timeIndex}/${zoom}/${x}/${y}.png`
          } as LayerProps
        ],
        cameraView: {lng: 0, lat: 0, altitude: distanceRef.current}
      });

      setGlobe(newGlobe);
    }
  }, [containerRef, globe]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${
        // x-value has to be divided by 2 because globe left/right margin is -50%
        relativePosition.x / 2
      }%, ${relativePosition.y}%)`;

      distanceRef.current =
        INITIAL_DISTANCE +
        INITIAL_DISTANCE * relativePosition.z * DISTANCE_INCREASEMENT_FACTOR;
    }
  }, [relativePosition.x, relativePosition.y, relativePosition.z]);

  useEffect(() => {
    containerRef.current?.style.setProperty(
      'visibility',
      isVisible ? 'visible' : 'hidden'
    );
  }, [isVisible]);

  useEffect(() => {
    (function spin() {
      rotationRef.current += 0.1;
      const lng = (rotationRef.current % 360) - 180;
      globe &&
        globe.setProps({
          cameraView: {lng, lat: 10, altitude: distanceRef.current}
        });

      if (isSpinning) {
        requestAnimationFrame(spin);
      }
    })();
  }, [isSpinning, globe]);

  useEffect(() => {
    (function move() {
      const storyElements = parallax.controller?.elements.filter(
        ({el}) => el.id === 'chapter'
      );

      const chapterElement = storyElements?.filter(({isInView}) => isInView)[0];

      // eslint-disable-next-line no-undefined
      if (!chapterElement) {
        requestAnimationFrame(move);
        return;
      }

      const chapterId = storyElements?.indexOf(chapterElement) + 1;

      const progress = chapterElement.progress;

      if (
        !chapterId ||
        !globe ||
        !containerRef.current ||
        !globeMovements[chapterId] ||
        // eslint-disable-next-line no-undefined
        progress === undefined ||
        progressRef.current === progress
      ) {
        requestAnimationFrame(move);
        return;
      }

      progressRef.current = progress;
      const globeContainer = containerRef.current;

      globeMovements[chapterId].forEach(({x, y, z}, index) => {
        const pagesInChapter = chapterElement.el.children.length + 1;

        // Calcutate the progress of the current movement
        let progressPercent = progress * 100 * pagesInChapter - index * 100;

        progressPercent = Math.min(100, Math.max(0, progressPercent));

        if (progressPercent <= 0) {
          return;
        }

        // Calculate the former movement of the globe to add them to the current movement
        const formerMovements = globeMovements[chapterId]
          .slice(0, index)
          .reduce(
            // eslint-disable-next-line max-nested-callbacks
            (allMoveBy, {x, y, z}) => {
              allMoveBy.x += x;
              allMoveBy.y += y;
              allMoveBy.z += z;
              return allMoveBy;
            },
            {x: 0, y: 0, z: 0}
          );

        moveGlobe(
          progressPercent,
          {x, y, z},
          formerMovements,
          relativePosition,
          globeContainer,
          distanceRef
        );
      });

      requestAnimationFrame(move);
    })();
  }, [parallax, globe, containerRef, globeMovements, relativePosition]);

  return (
    <>
      <div ref={containerRef} className={styles.globe} />
      <div ref={parallax.ref as LegacyRef<HTMLDivElement>}>{children}</div>
    </>
  );
};

export default Globe;
