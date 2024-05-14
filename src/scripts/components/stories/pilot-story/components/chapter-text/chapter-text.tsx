import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';
import SnapWrapper from '../snap-wrapper/snap-wrapper';

import styles from './chapter-text.module.styl';

interface Props {
  text: string;
  speed?: number;
}

const ChapterText: FunctionComponent<Props> = ({text, speed = 1}) => (
  <SnapWrapper>
    <Parallax speed={speed} className={styles.chapterText} opacity={[0, 2]}>
      {text}
    </Parallax>
  </SnapWrapper>
);

export default ChapterText;
