import React, {
  createContext,
  FunctionComponent,
  LegacyRef,
  useContext,
  useEffect,
  useRef
} from 'react';

import {LayerProps, MarkerProps, WebGlGlobe} from '@ubilabs/esa-webgl-globe';

import {useParallax} from 'react-scroll-parallax';

import {GlobeMovementsPerChapter} from '../../types/globe';

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

interface GlobeContextValue {
  markers: {
    markers: MarkerProps[];
    setMarkers: (markers: MarkerProps[]) => void;
  };
  layers: {
    layers: LayerProps[];
    setLayers: (layers: LayerProps[]) => void;
  };
  globe: {
    isSpinning: boolean;
    setIsSpinning: (isSpinning: boolean) => void;
    isTouchable: boolean;
    setIsTouchable: (isTouchable: boolean) => void;
  };
}

const GlobeContext = createContext<GlobeContextValue>({
  markers: {markers: [], setMarkers: () => {}},
  layers: {layers: [], setLayers: () => {}},
  globe: {
    isSpinning: false,
    setIsSpinning: () => {},
    isTouchable: false,
    setIsTouchable: () => {}
  }
});

const Globe: FunctionComponent<Props> = ({
  relativePosition,
  globeMovements,
  children
}) => {
  const parallax = useParallax({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef<number>(180);
  const distanceRef = useRef<number>(INITIAL_DISTANCE);
  const progressRef = useRef<number>(0);
  const [globe, setGlobe] = React.useState<WebGlGlobe | null>(null);
  const isSpinning = useRef<boolean>(true);
  const [markers, setMarkers] = React.useState<MarkerProps[]>([]);

  // Latest timestamp: December 2021
  const timeIndex = 71;
  // @ts-ignore - injected via webpack's define plugin
  const version = INFO_VERSION;

  const [layers, setLayers] = React.useState<LayerProps[]>([
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
  ]);

  const isTouchable = containerRef.current?.style.pointerEvents === 'initial';

  const setIsTouchable = (isTouchable: boolean) => {
    if (containerRef.current) {
      containerRef.current.style.pointerEvents = isTouchable
        ? 'initial'
        : 'none';
      containerRef.current.style.zIndex = isTouchable ? '1' : '0';
    }
  };

  useEffect(() => {
    if (containerRef.current && !globe) {
      const newGlobe = new WebGlGlobe(containerRef.current, {
        layers,
        markers,
        cameraView: {lng: 0, lat: 0, altitude: distanceRef.current}
      });

      setGlobe(newGlobe);

      setIsTouchable(false);
    }
  }, [containerRef, globe, layers, markers]);

  useEffect(() => {
    globe?.setProps({layers, markers});
  }, [globe, layers, markers]);

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
      // chapter elements are tagged with the id 'chapter'
      const chapterElements = parallax.controller?.elements.filter(
        ({el}) => el.id === 'chapter'
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
    <GlobeContext.Provider
      value={{
        markers: {markers, setMarkers},
        layers: {layers, setLayers},
        globe: {
          isSpinning: isSpinning.current,
          setIsSpinning: spinning => {
            isSpinning.current = spinning;
          },
          isTouchable,
          setIsTouchable
        }
      }}>
      <div ref={containerRef} className={styles.globe} />
      <div ref={parallax.ref as LegacyRef<HTMLDivElement>}>{children}</div>
    </GlobeContext.Provider>
  );
};

export const useGlobeMarkers = () => useContext(GlobeContext)?.markers;

export const useGlobe = () => useContext(GlobeContext)?.globe;

export default Globe;
