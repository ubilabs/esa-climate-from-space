import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';
import cx from 'classnames';

import SnapWrapper from '../snap-wrapper/snap-wrapper';

import styles from './chapter-text.module.styl';

export interface TextPageContent {
  title: string;
  text: string;
}

interface Props {
  text: string;
  title?: string;
  snapPosition?: string;
}

const ChapterText: FunctionComponent<Props> = ({text, title, snapPosition}) => (
  <SnapWrapper snapPosition={snapPosition}>
    <Parallax
      className={cx(styles.chapterText, title && styles.textSections)}
      opacity={[1.5, 0]}
      easing="easeInQuad">
      {title && <h3>{title}</h3>}
      <p>{text}</p>
    </Parallax>
  </SnapWrapper>
);

export default ChapterText;
