import React, {FunctionComponent, useMemo, useState} from 'react';
import cx from 'classnames';
import {Parallax} from 'react-scroll-parallax';

import {useScreenSize} from '../../../../../hooks/use-screen-size';
import {useGlobe} from '../../hooks/use-globe';

import {GlobeItem} from '../../../../../types/gallery-item';

import {INITIAL_DISTANCE} from '../globe/globe';

import ScrollHint from '../scroll-hint/scroll-hint';
import Button from '../button/button';
import StoryGlobe from '../../../story-globe/story-globe';
import {ArrowBackIcon} from '../../../../main/icons/arrow-back-icon';
import SnapWrapper from '../snap-wrapper/snap-wrapper';

import styles from './explore-dataset.module.styl';

interface Props {
  title: string;
  dataLayerId: string;
}

const ExploreDataset: FunctionComponent<Props> = ({title, dataLayerId}) => {
  const {isMobile} = useScreenSize();
  const {setIsVisible} = useGlobe();
  const [showExplorableGlobe, setShowExplorableGlobe] = useState(false);

  const globeItem = useMemo(
    () =>
      ({
        flyTo: {
          position: {
            longitude: 0,
            latitude: 0,
            height: INITIAL_DISTANCE
          }
        },
        layer: [
          {
            id: dataLayerId
          }
        ]
      } as GlobeItem),
    [dataLayerId]
  );

  return (
    <SnapWrapper
      className={cx(
        styles.explore,
        showExplorableGlobe && styles.exploreGlobe
      )}>
      {showExplorableGlobe ? (
        <div className={styles.globeContainer}>
          <Button
            className={styles.backButton}
            icon={ArrowBackIcon}
            label="Back to Story"
            onClick={() => {
              setShowExplorableGlobe(false);
              setIsVisible(true);
            }}
            isBackButton
          />
          <StoryGlobe globeItem={globeItem} backgroundColor="#FFFFFF" />
        </div>
      ) : (
        <Parallax className={styles.exploreContent}>
          <h1>{title}</h1>

          <div className={styles.buttonContainer}>
            <Button
              label="Explore Dataset"
              onClick={() => {
                setShowExplorableGlobe(true);
                setIsVisible(false);
              }}
            />
            {isMobile && <ScrollHint />}
          </div>
        </Parallax>
      )}
    </SnapWrapper>
  );
};

export default ExploreDataset;
