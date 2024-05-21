import React, {FunctionComponent, useEffect, useState} from 'react';
import {Parallax} from 'react-scroll-parallax';
import {useGlobe, useGlobeMarkers} from '../../hooks/use-globe';

import SnapWrapper from '../snap-wrapper/snap-wrapper';

import {MarkerProps} from '@ubilabs/esa-webgl-globe';

export interface MarkersPageContent {
  markers: MarkerProps[];
}

const ChapterMarkers: FunctionComponent<MarkersPageContent> = ({markers}) => {
  const [isInView, setIsInView] = useState(false);
  const {setMarkers} = useGlobeMarkers();
  const {setIsSpinning, setIsTouchable} = useGlobe();

  useEffect(() => {
    if (isInView) {
      setMarkers(markers);
      setIsSpinning(false);
      setIsTouchable(true);
    } else {
      setMarkers([]);
      setIsSpinning(true);
      setIsTouchable(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, setMarkers, markers]);

  return (
    <SnapWrapper>
      <Parallax
        onEnter={() => setIsInView(true)}
        onExit={() => setIsInView(false)}></Parallax>
    </SnapWrapper>
  );
};

export default ChapterMarkers;
