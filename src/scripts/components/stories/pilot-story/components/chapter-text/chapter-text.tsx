import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';

import styles from './chapter-text.module.styl';

interface Props {
  text: string;
}

const ChapterText: FunctionComponent<Props> = ({text}) => (
  <Parallax speed={10} className={styles.chapterText} opacity={[0, 2]}>
    {text}
  </Parallax>
);

export default ChapterText;
