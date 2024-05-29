import React, {FunctionComponent, useEffect, useState} from 'react';
import {Parallax} from 'react-scroll-parallax';
import {createPortal} from 'react-dom';

import {useGlobe, useGlobeMarkers} from '../../hooks/use-globe';

import {MarkerProps} from '@ubilabs/esa-webgl-globe';

import SnapWrapper from '../snap-wrapper/snap-wrapper';
import Button from '../button/button';
import {ArrowBackIcon} from '../../../../main/icons/arrow-back-icon';
import ScrollHint from '../scroll-hint/scroll-hint';

import styles from './chapter-marker.module.styl';

interface Props {
  markers: MarkerProps[];
  onBackToStory: () => void;
}

const ChapterMarkers: FunctionComponent<Props> = ({
  markers,
  onBackToStory: onBackToStory
}) => {
  const [isInView, setIsInView] = useState(false);
  const {setMarkers} = useGlobeMarkers();
  const {setIsSpinning, setIsTouchable} = useGlobe();

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
        {isInView &&
          floatingButtonContainer &&
          createPortal(
            <>
              <Button
                className={styles.button}
                icon={ArrowBackIcon}
                label="Back to Main Story"
                onClick={() => {
                  onBackToStory();
                }}
                isBackButton
              />
              <ScrollHint isSelectHint />
              {/* <TouchIcon /> */}
            </>,
            floatingButtonContainer
          )}
      </Parallax>
    </SnapWrapper>
  );
};

export default ChapterMarkers;
