import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';
import cx from 'classnames';

import {GlobeIcon} from '../../../../main/icons/globe-icon';
import ScrollHint from '../scroll-hint/scroll-hint';
import Button from '../button/button';

import styles from './story-intro.module.styl';

interface Props {
  storyStarted: boolean;
  onStoryStart: () => void;
}

const StoryIntro: FunctionComponent<Props> = ({storyStarted, onStoryStart}) => (
  <section className={styles.intro}>
    <Button
      link={'/stories'}
      icon={GlobeIcon}
      label="Back to Stories"
      className={cx(styles.backToStories, storyStarted && styles.hidden)}
      isBackButton
    />

    <Parallax className={styles.introContent}>
      <div className={cx(storyStarted && styles.hidden)}>
        <h1 className={styles.storyTitle}>
          Inside the world of Super Emitters
        </h1>
        <p className={styles.storyDescription}>
          Explore the world of methane super emitters – key players in climate
          change.
        </p>
      </div>

      <div className={styles.buttonContainer}>
        {storyStarted ? (
          <Parallax style={{width: '100%'}} opacity={[1, 0]} speed={2}>
            <ScrollHint />
          </Parallax>
        ) : (
          <>
            <Button
              label="Story"
              onClick={onStoryStart}
              id={styles.whiteButton}
            />
            <Button link={'/'} label="Datasets" />
          </>
        )}
      </div>
    </Parallax>
  </section>
);

export default StoryIntro;
