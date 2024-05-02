import React, {FunctionComponent, useEffect, useRef} from 'react';

import {LayerProps, WebGlGlobe} from '@ubilabs/esa-webgl-globe';

import styles from './globe.module.styl';

interface Props {
  progress: number;
  isSpinning: boolean;
}

const Globe: FunctionComponent<Props> = ({progress, isSpinning}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef<number>(180);
  const [globe, setGlobe] = React.useState<WebGlGlobe | null>(null);

  const DISTANCE = 30_000_000;

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
        cameraView: {lng: 0, lat: 0, altitude: DISTANCE}
      });

      setGlobe(newGlobe);
    }
  }, [containerRef, globe]);

  useEffect(() => {
    (function spin() {
      rotationRef.current += 0.1;
      const lng = (rotationRef.current % 360) - 180;
      globe && globe.setProps({cameraView: {lng, lat: 10, altitude: DISTANCE}});

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

    globeContainer.style.left = `${(100 - progress / 2) * -1}%`;
    if (progress && globeContainer.style.right !== 'initial') {
      globeContainer.style.right = 'initial';
    }
  }, [progress, globe, containerRef]);

  return <div className={styles.globe} ref={containerRef} />;
};

export default Globe;
