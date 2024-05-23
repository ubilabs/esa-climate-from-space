import React, {
  FunctionComponent,
  LegacyRef,
  useEffect,
  useRef,
  useState
} from 'react';
import {useGlobe, useGlobeLayers, useGlobeMarkers} from '../../hooks/use-globe';

import {WebGlGlobe} from '@ubilabs/esa-webgl-globe';

import {useParallax} from 'react-scroll-parallax';

import {GlobeMovementsPerChapter} from '../../types/globe';

import {chapterMainElement} from '../../config/main';

import styles from './globe.module.styl';

const INITIAL_DISTANCE = 30_000_000;
const DISTANCE_INCREASEMENT_FACTOR = 0.02;

function moveGlobe(
  progressPercent: number,
  moveBy: {x: number; y: number; z: number},
  formerMovements: {x: number; y: number; z: number},
  relativePosition: {x: number; y: number; z: number},
  globeContainer: HTMLDivElement,
  distanceRef: React.MutableRefObject<number>
) {
  // Change globe x/y-position
  const moveToX =
    relativePosition.x + formerMovements.x + progressPercent / (100 / moveBy.x);

  const moveToY =
    relativePosition.y + formerMovements.y + progressPercent / (100 / moveBy.y);

  globeContainer.style.transform = `translate(${
    // x-value has to be divided by 3 because globe left/right margin is -100%
    moveToX / 3
  }%, ${moveToY}%)`;

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
  globeMovements: GlobeMovementsPerChapter;
  children: React.ReactNode;
}

const Globe: FunctionComponent<Props> = ({
  relativePosition,
  globeMovements,
  children
}) => {
  const parallax = useParallax({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [globe, setGlobe] = useState<WebGlGlobe | null>(null);
  const rotationRef = useRef<number>(180);
  const distanceRef = useRef<number>(INITIAL_DISTANCE);
  const progressRef = useRef<number>(0);

  const {markers} = useGlobeMarkers();
  const {layers} = useGlobeLayers();
  const {isSpinning, isTouchable} = useGlobe();

  useEffect(() => {
    if (containerRef.current && !globe) {
      const newGlobe = new WebGlGlobe(containerRef.current, {
        layers,
        markers,
        cameraView: {lng: 0, lat: 0, altitude: distanceRef.current}
      });

      if ('renderer' in newGlobe) {
        // Zoom is disabled for pilot story
        // @ts-ignore Property 'renderer' is private and only accessible within class 'WebGlGlobe'.
        newGlobe.renderer.globeControls.enableZoom = false;
      }

      setGlobe(newGlobe);
    }
  }, [containerRef, globe, layers, markers]);

  useEffect(() => {
    globe?.setProps({layers, markers});
  }, [globe, layers, markers]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.pointerEvents = isTouchable.current
        ? 'initial'
        : 'none';
      containerRef.current.style.zIndex = isTouchable.current ? '1' : '0';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTouchable.current, containerRef]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${
        // x-value has to be divided by 3 because globe left/right margin is -100%
        relativePosition.x / 3
      }%, ${relativePosition.y}%)`;

      distanceRef.current =
        INITIAL_DISTANCE +
        INITIAL_DISTANCE * relativePosition.z * DISTANCE_INCREASEMENT_FACTOR;
    }
  }, [relativePosition.x, relativePosition.y, relativePosition.z]);

  useEffect(() => {
    (function spin() {
      rotationRef.current += 0.1;
      const lng = (rotationRef.current % 360) - 180;
      globe &&
        globe.setProps({
          cameraView: {lng, lat: 10, altitude: distanceRef.current}
        });

      if (isSpinning.current) {
        requestAnimationFrame(spin);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globe, isSpinning.current]);

  useEffect(() => {
    (function move() {
      // chapter elements are tagged with the id 'chapter-main
      const chapterElements = parallax.controller?.elements.filter(
        ({el}) => el.id === chapterMainElement
      );

      // Get current chapter by retrieving first chapter element in view
      const chapterElement = chapterElements?.filter(
        ({isInView}) => isInView
      )[0];

      // eslint-disable-next-line no-undefined
      if (!chapterElement) {
        requestAnimationFrame(move);
        return;
      }

      // Get the chapter number by finding the index of the current chapter element
      const chapterNumber = chapterElements?.indexOf(chapterElement) + 1;

      const progress = chapterElement.progress;

      if (
        !chapterNumber ||
        !globe ||
        !containerRef.current ||
        !globeMovements[chapterNumber] ||
        // eslint-disable-next-line no-undefined
        progress === undefined ||
        progressRef.current === progress
      ) {
        requestAnimationFrame(move);
        return;
      }

      progressRef.current = progress;
      const globeContainer = containerRef.current;

      // Chapter pages are children of current chapter element
      const pagesInChapter = chapterElement.el.children.length;

      globeMovements[chapterNumber].forEach(({x, y, z}, index) => {
        // Calcutate the progress of the current movement
        let progressPercent =
          progress * 100 * (pagesInChapter + 1) - index * 100;

        progressPercent = Math.min(100, Math.max(0, progressPercent));

        if (progressPercent <= 0) {
          return;
        }

        // Calculate the former movement of the globe to add them to the current movement
        const formerMovements = [
          ...Object.keys(globeMovements)
            // eslint-disable-next-line max-nested-callbacks
            .filter(chapter => Number(chapter) < chapterNumber)
            // eslint-disable-next-line max-nested-callbacks
            .map(chapter => globeMovements[Number(chapter)])
            .flat(),
          ...globeMovements[chapterNumber].slice(0, index)
        ].reduce(
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
      <div ref={parallax.ref as LegacyRef<HTMLDivElement>} id="story">
        {children}
      </div>
    </>
  );
};

export default Globe;
