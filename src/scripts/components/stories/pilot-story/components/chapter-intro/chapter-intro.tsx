import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';

import {GlobeIcon} from '../../../../main/icons/globe-icon';
import ScrollHint from '../scroll-hint/scroll-hint';
import Button from '../button/button';
import SnapWrapper from '../snap-wrapper/snap-wrapper';

import styles from './chapter-intro.module.styl';

interface Props {
  title: string;
  subTitle: string;
}

const ChapterIntro: FunctionComponent<Props> = ({title, subTitle}) => (
  <SnapWrapper>
    <Parallax className={styles.intro} opacity={[0, 2]}>
      <Button
        link={'/stories'}
        icon={GlobeIcon}
        label="Back to Stories"
        className={styles.backToStories}
        isBackButton
      />

      <Parallax
        className={styles.introContent}
        translateX={[-110, 100, 'easeInOutQuad']}
        opacity={[2, 0]}>
        <h2 className={styles.subTitle}>{subTitle}</h2>
        <p className={styles.title}>{title}</p>
      </Parallax>

      <Parallax opacity={[1, 0]} style={{marginBottom: '50px'}}>
        <ScrollHint />
      </Parallax>
    </Parallax>
  </SnapWrapper>
);

export default ChapterIntro;
