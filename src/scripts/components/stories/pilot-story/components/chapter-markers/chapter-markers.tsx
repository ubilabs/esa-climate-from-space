import React, {FunctionComponent, useEffect, useState} from 'react';
import {Parallax} from 'react-scroll-parallax';
import {createPortal} from 'react-dom';

import {useGlobe, useGlobeMarkers} from '../../hooks/use-globe';
import {useScreenSize} from '../../../../../hooks/use-screen-size';

import {MarkerProps} from '@ubilabs/esa-webgl-globe';

import SnapWrapper from '../snap-wrapper/snap-wrapper';
import Button from '../button/button';

import styles from './chapter-marker.module.styl';

interface Props {
  markers: MarkerProps[];
  onNextChapter: () => void;
}

const ChapterMarkers: FunctionComponent<Props> = ({markers, onNextChapter}) => {
  const [isInView, setIsInView] = useState(false);
  const {setMarkers} = useGlobeMarkers();
  const {setIsSpinning, setIsTouchable} = useGlobe();
  const {isMobile} = useScreenSize();

  const floatingButtonContainer = document.getElementById(
    'floating-button-container'
  );

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
        onExit={() => setIsInView(false)}>
        {isMobile &&
          isInView &&
          floatingButtonContainer &&
          createPortal(
            <div className={styles.buttonContainer}>
              <Button label="Next Chapter" onClick={onNextChapter} />
            </div>,
            floatingButtonContainer
          )}
      </Parallax>
    </SnapWrapper>
  );
};

export default ChapterMarkers;
