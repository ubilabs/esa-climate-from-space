import React, {FunctionComponent, useEffect, useRef} from 'react';

import {LayerProps, WebGlGlobe} from '@ubilabs/esa-webgl-globe';

import {GlobeMovement, GlobeMovementDirection} from '../../types/globe';

import styles from './globe.module.styl';

const INITIAL_DISTANCE = 30_000_000;

interface Props {
  progress: number;
  isSpinning: boolean;
  isVisible: boolean;
  viewTotal: number;
  globeMovement: GlobeMovement[];
}

const Globe: FunctionComponent<Props> = ({
  progress,
  isSpinning,
  isVisible,
  viewTotal,
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

    globeMovement.forEach(({viewFrom, viewTo, direction}) => {
      const viewCount = viewTo - (viewFrom - 1);

      // Calcutate the progress of the current movement
      const progressPercent = Math.round(
        progress * 100 * (viewTotal / (viewCount - 1)) - (viewFrom - 1) * 100
      );

      if (progressPercent >= 0 && progressPercent <= 100) {
        if (direction === GlobeMovementDirection.RIGHT) {
          globeContainer.style.left = `${(100 - progressPercent / 2) * -1}%`;
          if (progress && globeContainer.style.right !== 'initial') {
            globeContainer.style.right = 'initial';
          }
        }
        if (direction === GlobeMovementDirection.OUT) {
          distanceRef.current =
            INITIAL_DISTANCE + (INITIAL_DISTANCE * progressPercent) / 100;
          globe.setProps({
            cameraView: {
              // @ts-ignore Property 'renderer' is private and only accessible within class 'WebGlGlobe'.
              ...globe.renderer.cameraView,
              altitude: distanceRef.current
            }
          });
        }
      }
    });
  }, [progress, globe, containerRef, globeMovement, viewTotal]);

  return <div className={styles.globe} ref={containerRef} />;
};

export default Globe;
