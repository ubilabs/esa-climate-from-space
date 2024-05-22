import React, {FunctionComponent, useEffect, useState} from 'react';
import {Parallax} from 'react-scroll-parallax';

import {GlobeIcon} from '../../../../main/icons/globe-icon';
import ScrollHint from '../scroll-hint/scroll-hint';
import Button from '../button/button';
import SnapWrapper from '../snap-wrapper/snap-wrapper';

import {chapterIntroElement} from '../../config/main';

import cx from 'classnames';
import styles from './chapter-intro.module.styl';

interface Props {
  title: string;
  subTitle: string;
  scrollIndex: number;
}

const ChapterIntro: FunctionComponent<Props> = ({
  title,
  subTitle,
  scrollIndex
}) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(progress >= 0.5 && progress <= 0.55);
  }, [progress]);

  return (
    <SnapWrapper>
      <Parallax
        className={cx(styles.intro, visible && styles.visible)}
        onProgressChange={progress => setProgress(progress)}>
        <Button
          link={'/stories'}
          icon={GlobeIcon}
          label="Back to Stories"
          className={cx(styles.introBackButton, visible && styles.visible)}
          isBackButton
        />

        <div className={cx(styles.introContent)}>
          <h2
            className={cx(styles.subTitle, chapterIntroElement)}
            data-scroll-index-intro={scrollIndex}>
            {subTitle}
          </h2>
          <p className={styles.title}>{title}</p>
        </div>
      </Parallax>
      <Parallax speed={-50} translateY={[-100, 100]} easing="easeOutQuad">
        <ScrollHint />
      </Parallax>
    </SnapWrapper>
  );
};

export default ChapterIntro;
