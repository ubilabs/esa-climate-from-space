import React, {FunctionComponent} from 'react';
import {EffectNumber, Parallax} from 'react-scroll-parallax';
import cx from 'classnames';

import SnapWrapper from '../snap-wrapper/snap-wrapper';

import styles from './chapter-text.module.styl';

export interface TextPageContent {
  text: string;
  title?: string;
  speed?: number;
  translate?: EffectNumber;
}

interface Props {
  text: string | TextPageContent[];
  snapPosition?: string;
}

const ChapterText: FunctionComponent<Props> = ({text, snapPosition}) => (
  <SnapWrapper snapPosition={snapPosition}>
    {Array.isArray(text) ? (
      text.map(({title, text, speed, translate}, index) => (
        <Parallax
          key={index}
          speed={speed}
          className={cx(styles.chapterText, title && styles.textSections)}
          translateY={translate ?? [0, 0]}
          easing="easeInQuad">
          <h3>{title}</h3>
          <p>{text}</p>
        </Parallax>
      ))
    ) : (
      <Parallax className={styles.chapterText} opacity={[0, 2]}>
        <p>{text}</p>
      </Parallax>
    )}
  </SnapWrapper>
);

export default ChapterText;
