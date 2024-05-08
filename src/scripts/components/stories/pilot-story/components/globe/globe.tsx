import React, {FunctionComponent, useEffect, useRef} from 'react';

import {LayerProps, WebGlGlobe} from '@ubilabs/esa-webgl-globe';

import {GlobeMovement, GlobeMovementDirection} from '../../types/globe';

import styles from './globe.module.styl';

const INITIAL_DISTANCE = 30_000_000;

interface Props {
  progress: number;
  relativePosition: {x: number; y: number};
  isSpinning: boolean;
  isVisible: boolean;
  pagesTotal: number;
  globeMovement: GlobeMovement[];
}

const Globe: FunctionComponent<Props> = ({
  progress,
  relativePosition,
  isSpinning,
  isVisible,
  pagesTotal,
  globeMovement
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef<number>(180);
  const distanceRef = useRef<number>(INITIAL_DISTANCE);
  const [globe, setGlobe] = React.useState<WebGlGlobe | null>(null);

  useEffect(() => {
    if (containerRef.current && !globe) {
      // Latest timestamp: December 2021
      const timeIndex = 227;
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
            type: 'image',
            maxZoom: 3,
            urlParameters: {},
            getUrl: () =>
              `https://storage.googleapis.com/esa-cfs-tiles/${version}/greenhouse.xch4/tiles/${timeIndex}/full.png`
          } as LayerProps
        ],
        cameraView: {lng: 0, lat: 0, altitude: distanceRef.current}
      });

      setGlobe(newGlobe);
    }
  }, [containerRef, globe]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${relativePosition.x}%, ${relativePosition.y}%)`;
    }
  }, [relativePosition.x, relativePosition.y]);

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
    if (!globe || !containerRef.current) {
      return;
    }
    const globeContainer = containerRef.current;

    globeMovement.forEach(({pageFrom, pageTo, relativeExtend, direction}) => {
      const viewCount = pageTo - (pageFrom - 1);

      // Calcutate the progress of the current movement
      let progressPercent =
        progress * 100 * (pagesTotal / (viewCount - 1)) - (pageFrom - 1) * 100;

      progressPercent = Math.min(100, Math.max(0, progressPercent));

      if (progressPercent === 0) {
        return;
      }

      const transform = (
        globeContainer.style.transform.match(/(-?[0-9\.]+)/g) || [0, 0]
      ).map(Number);

      switch (direction) {
        case GlobeMovementDirection.RIGHT:
          globeContainer.style.transform = `translate(${
            relativePosition.x + progressPercent / (100 / relativeExtend)
          }%, ${transform[1]}%)`;
          break;
        case GlobeMovementDirection.DOWN:
          globeContainer.style.transform = `translate(${transform[0]}%, ${
            relativePosition.y + progressPercent / (100 / relativeExtend)
          }%)`;
          break;
        case GlobeMovementDirection.OUT:
          distanceRef.current =
            INITIAL_DISTANCE +
            (INITIAL_DISTANCE * progressPercent * (relativeExtend / 50)) / 100;
          break;
        case GlobeMovementDirection.IN:
          if (!progressPercent) {
            break;
          }
          distanceRef.current =
            INITIAL_DISTANCE +
            (INITIAL_DISTANCE *
              ((100 - progressPercent) * (relativeExtend / 50))) /
              100;
          break;
      }
    });
  }, [
    progress,
    globe,
    containerRef,
    globeMovement,
    pagesTotal,
    relativePosition.x,
    relativePosition.y
  ]);

  return <div className={styles.globe} ref={containerRef} />;
};

export default Globe;
