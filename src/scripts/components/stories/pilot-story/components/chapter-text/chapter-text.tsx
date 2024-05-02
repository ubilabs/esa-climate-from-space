import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';

import styles from './chapter-text.module.styl';

const ChapterText: FunctionComponent = () => (
  <Parallax speed={10} className={styles.chapterText} opacity={[0, 2]}>
    Methane is a potent greenhouse gas, far more effective than carbon dioxide
    at trapping heat in the atmosphere over a 20-year period.
  </Parallax>
);

export default ChapterText;
