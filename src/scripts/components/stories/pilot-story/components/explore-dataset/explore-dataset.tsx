import React, {FunctionComponent, useMemo, useState} from 'react';
import {Parallax} from 'react-scroll-parallax';

import {useScreenSize} from '../../../../../hooks/use-screen-size';

import {GlobeItem} from '../../../../../types/gallery-item';

import {INITIAL_DISTANCE} from '../globe/globe';

import ScrollHint from '../scroll-hint/scroll-hint';
import Button from '../button/button';
import StoryGlobe from '../../../story-globe/story-globe';
import {ArrowBackIcon} from '../../../../main/icons/arrow-back-icon';

import styles from './explore-dataset.module.styl';
import SnapWrapper from '../snap-wrapper/snap-wrapper';

interface Props {
  title: string;
  dataLayerId: string;
}

const ExploreDataset: FunctionComponent<Props> = ({title, dataLayerId}) => {
  const {isMobile} = useScreenSize();
  const [showExplorableGlobe, setShowLayerDetails] = useState(false);

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
    <div className={styles.explore}>
      {showExplorableGlobe ? (
        <div className={styles.globeContainer}>
          <Button
            className={styles.backButton}
            icon={ArrowBackIcon}
            label="Back to Story"
            onClick={() => {
              setShowLayerDetails(false);
            }}
            isBackButton
          />
          <StoryGlobe globeItem={globeItem} />
        </div>
      ) : (
        <Parallax className={styles.exploreContent}>
          <h1>{title}</h1>

          <div className={styles.buttonContainer}>
            <Button
              label="Explore Dataset"
              onClick={() => setShowLayerDetails(true)}
            />
            {isMobile && <ScrollHint />}
          </div>
        </Parallax>
      )}
    </div>
  );
};

export default ExploreDataset;
