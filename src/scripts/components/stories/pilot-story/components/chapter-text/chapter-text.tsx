import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';
import SnapWrapper from '../snap-wrapper/snap-wrapper';

import styles from './chapter-text.module.styl';

interface Props {
  text: string;
}

const ChapterText: FunctionComponent<Props> = ({text}) => (
  <SnapWrapper>
    <Parallax speed={10} className={styles.chapterText} opacity={[0, 2]}>
      {text}
    </Parallax>
  </SnapWrapper>
);

export default ChapterText;
