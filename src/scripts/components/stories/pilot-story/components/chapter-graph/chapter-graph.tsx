import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';

import Legend, {LegendItems} from '../legend/legend';

import styles from './chapter-graph.module.styl';

interface Props {
  graph: {
    title: string;
    src: string;
    alt: string;
    caption?: string;
    legendItems?: LegendItems[];
  };
}

const ChapterGraph: FunctionComponent<Props> = ({graph}) => {
  const {title, src, alt, caption, legendItems} = graph;

  return (
    <Parallax className={styles.chapterGraph} opacity={[0, 2]}>
      {legendItems ? (
        <Legend
          title="Some of the primary sources include:"
          legendItems={legendItems}
        />
      ) : (
        <Parallax speed={20} className={styles.graphText} easing="easeInQuad">
          <h3>{title}</h3>
        </Parallax>
      )}

      <div className={styles.graphContainer}>
        <div className={styles.scrollContainer}>
          <img src={src} alt={alt}></img>
        </div>
        {caption && <p className={styles.graphCaption}>{caption}</p>}
      </div>
    </Parallax>
  );
};

export default ChapterGraph;
