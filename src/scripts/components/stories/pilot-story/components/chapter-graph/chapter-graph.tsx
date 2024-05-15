import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';

import styles from './chapter-graph.module.styl';

interface Props {
  graph: {
    title: string;
    src: string;
    alt: string;
    caption: string;
  };
}

const ChapterGraph: FunctionComponent<Props> = ({graph}) => (
  <Parallax className={styles.chapterGraph} opacity={[2, 0]}>
    <Parallax speed={20} className={styles.graphText} easing="easeInQuad">
      <h3>{graph.title}</h3>
    </Parallax>
    <div className={styles.graphContainer}>
      <img src={graph.src} alt={graph.alt}></img>
      <p className={styles.graphCaption}>{graph.caption}</p>
    </div>
  </Parallax>
);

export default ChapterGraph;
