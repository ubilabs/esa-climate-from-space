import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';

import styles from './chapter-text.module.styl';

interface Props {
  content: string;
}

const ChapterText: FunctionComponent<Props> = ({content}) => (
  <Parallax speed={10} className={styles.chapterText} opacity={[0, 2]}>
    {content}
  </Parallax>
);

export default ChapterText;
