import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';

import countingCarbon from '../../assets/07-counting-carbon.png';
import carbonCycle from '../../assets/07-carbon-cycle.png';

import {chapterIntroElement} from '../../config/main';

import Button from '../button/button';
import Chapter from '../chapter/chapter';
import SnapWrapper from '../snap-wrapper/snap-wrapper';
import {ArrowForwardIcon} from '../../../../main/icons/arrow-forward-icon';

import cx from 'classnames';

import styles from './explore-stories.module.styl';

interface Props {
  chapterIndex: number;
}

const ExploreStories: FunctionComponent<Props> = ({chapterIndex}) => (
  <Chapter scrollIndex={chapterIndex}>
    <SnapWrapper className={styles.outro}>
      <Parallax speed={2}>
        <h2
          className={cx(styles.exploreText, chapterIntroElement)}
          data-scroll-index-intro={chapterIndex}>
          Read other stories that are similar to this story.
        </h2>
      </Parallax>

      <div className={styles.storiesContainer}>
        <div className={styles.storyItem}>
          <img src={carbonCycle} alt="Carbon Cycle Story" />
          <h1>The Carbon Cycle</h1>
          <p>
            Carbon, abundant and vital for life, cycles through nature. However,
            human activity disrupts this, impacting Earth`s climate.
          </p>
          <Button
            className={styles.exploreButton}
            label="read more"
            icon={ArrowForwardIcon}
            link={'/stories/story-12/0'}
          />
        </div>
        <div className={styles.storyItem}>
          <img src={countingCarbon} alt="Counting Carbon Story" />
          <h1>Counting Carbon</h1>
          <Button
            className={styles.exploreButton}
            label="read more"
            icon={ArrowForwardIcon}
            link={'/stories/story-38/0'}
          />
        </div>
      </div>
    </SnapWrapper>
  </Chapter>
);

export default ExploreStories;
