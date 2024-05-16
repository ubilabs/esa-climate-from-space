import React, {FunctionComponent, useEffect, useState} from 'react';
import {Parallax} from 'react-scroll-parallax';
import cx from 'classnames';

import {GlobeIcon} from '../../../../main/icons/globe-icon';
import ScrollHint from '../scroll-hint/scroll-hint';
import Button from '../button/button';
import SnapWrapper from '../snap-wrapper/snap-wrapper';

import styles from './chapter-intro.module.styl';

interface Props {
  title: string;
  subTitle: string;
}

const ChapterIntro: FunctionComponent<Props> = ({title, subTitle}) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(progress >= 0.49 && progress <= 0.51);
  }, [progress]);

  return (
    <SnapWrapper>
      <Parallax
        className={cx(styles.intro, visible && styles.visible)}
        onProgressChange={progress => setProgress(progress)}
        speed={-100}>
        <Button
          link={'/stories'}
          icon={GlobeIcon}
          label="Back to Stories"
          className={styles.backToStories}
          isBackButton
        />

        <div className={styles.introContent}>
          <h2 className={styles.subTitle}>{subTitle}</h2>
          <p className={styles.title}>{title}</p>
        </div>

        <div style={{marginBottom: '50px'}}>
          <ScrollHint />
        </div>
      </Parallax>
    </SnapWrapper>
  );
};

export default ChapterIntro;
