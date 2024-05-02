import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';
import cx from 'classnames';

import {GlobeIcon} from '../../../../main/icons/globe-icon';
import ScrollHint from '../scroll-hint/scroll-hint';
import Button from '../button/button';

import styles from './intro.module.styl';

interface Props {
  storyStarted: boolean;
  onStoryStart: () => void;
}

const Intro: FunctionComponent<Props> = ({storyStarted, onStoryStart}) => (
  <section className={styles.intro}>
    <div className={cx(styles.backContainer, storyStarted && styles.hidden)}>
      <Button
        link={'/stories'}
        icon={GlobeIcon}
        label="Back to Stories"
        isBackButton
      />
    </div>

    <Parallax opacity={[2, 0]}>
      <>
        <h1 className={styles.storyTitle}>
          Inside the world of Super Emitters
        </h1>
        <p className={styles.storyDescription}>
          Explore the world of methane super emitters – key players in climate
          change.
        </p>
      </>
    </Parallax>

    {storyStarted ? (
      <Parallax opacity={[1, 0]} className={styles.scrollinfoContainer}>
        <ScrollHint />
      </Parallax>
    ) : (
      <div className={styles.buttonContainer}>
        <Button label="Story" onClick={onStoryStart} id={styles.whiteButton} />
        <Button link={'/'} label="Datasets" />
      </div>
    )}
  </section>
);

export default Intro;
