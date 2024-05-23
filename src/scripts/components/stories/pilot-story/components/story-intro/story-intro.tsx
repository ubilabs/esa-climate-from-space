import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';
import cx from 'classnames';

import {GlobeIcon} from '../../../../main/icons/globe-icon';
import ScrollHint from '../scroll-hint/scroll-hint';
import Button from '../button/button';
import {scrollToChapterIndex} from '../nav-chapter-overview/nav-chapter-overview';

import styles from './story-intro.module.styl';

interface Props {
  storyStarted: boolean;
  onStoryStart: () => void;
}

const StoryIntro: FunctionComponent<Props> = ({storyStarted, onStoryStart}) => (
  <section className={cx(styles.intro, storyStarted && styles.hidden)}>
    <Button
      link={'/stories'}
      icon={GlobeIcon}
      label="Back to Stories"
      className={styles.backToStories}
      isBackButton
    />

    <Parallax>
      <h1 className={styles.storyTitle}>Inside the world of Super Emitters</h1>
      <p className={styles.storyDescription}>
        Explore the world of methane super emitters – key players in climate
        change.
      </p>

      <div className={styles.buttonContainer}>
        {storyStarted ? (
          <Parallax style={{width: '100%'}} speed={2}>
            <ScrollHint />
          </Parallax>
        ) : (
          <>
            <Button
              label="Story"
              onClick={() => {
                onStoryStart();
                // Automatically scroll to the first chapter when the story starts
                const timeout = setTimeout(() => {
                  scrollToChapterIndex(0);
                }, 1000);

                return () => clearTimeout(timeout);
              }}
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
