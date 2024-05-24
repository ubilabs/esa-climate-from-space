import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';

import countingCarbon from '../../assets/07-counting-carbon.png';
import carbonCycle from '../../assets/07-carbon-cycle.png';
import Button from '../button/button';
import {ArrowForwardIcon} from '../../../../main/icons/arrow-forward-icon';

import styles from './explore-stories.module.styl';

import cx from 'classnames';
import Chapter from '../chapter/chapter';

interface Props {
  chapterIndex: number;
}

const ExploreStories: FunctionComponent<Props> = ({chapterIndex}) => (
  <Chapter className={styles.exploreStories} scrollIndex={chapterIndex}>
    <Parallax speed={-5}>
      <h1
        className={cx(styles.exploreText, 'chapter-intro')}
        data-scroll-index-intro={chapterIndex}>
        Read other stories that are similar to this story.
      </h1>
    </Parallax>
    <div className={styles.storiesContainer}>
      <div className={styles.storyItem}>
        <Parallax opacity={[0, 2]}>
          <img src={carbonCycle} alt="Carbon Cycle Story" />
        </Parallax>
        <h1>The Carbon Cycle</h1>
        <p>
          Carbon is one of the most abundant elements in the universe and the
          basis of all life on Earth. It passes through the atmosphere, the
          oceans, plants and rocks, but this natural cycle has been disrupted by
          human activity, with profound implications for Earth’s climate.
        </p>
        <Button
          className={styles.exploreButton}
          label="read more"
          icon={ArrowForwardIcon}
          link={'/stories/story-12/0'}
        />
      </div>
      <div className={styles.storyItem}>
        <Parallax opacity={[0, 2]}>
          <img src={countingCarbon} alt="Counting Carbon Story" />
        </Parallax>
        <h1>Counting Carbon</h1>
        <Button
          className={styles.exploreButton}
          label="read more"
          icon={ArrowForwardIcon}
          link={'/stories/story-38/0'}
        />
      </div>
    </div>
  </Chapter>
);

export default ExploreStories;
