import React, {FunctionComponent} from 'react';

import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText from '../chapter-text/chapter-text';
import Chapter from '../chapter/chapter';

import PilotCarousel from '../pilot-carousel/pilot-carousel';
import ExploreDataset from '../explore-dataset/explore-dataset';

import styles from './02-chapter.module.styl';

interface Props {
  chapterIndex: number;
}

const ChapterTwo: FunctionComponent<Props> = ({chapterIndex}) => (
  <Chapter scrollIndex={chapterIndex} className={styles.sectionContainer}>
    <ChapterIntro
      scrollIndex={chapterIndex}
      subTitle="Chapter 2: Methane Sources"
      title="Where does methane come from?"
    />
    <ChapterText text="Methane emissions arise from a multitude of sources, spanning both natural processes and human activities." />
    <ChapterText text="These sources contribute to the complex dynamics of methane concentrations in the atmosphere, playing a significant role in global climate change." />
    <ChapterText text="Understanding where methane comes from is essential for creating effective ways to reduce its harm to the environment and human health." />
    <PilotCarousel />
    <ExploreDataset
      title="Explore the world of methane super emitters – key players in climate change."
      dataLayerId="greenhouse.xch4"
    />
  </Chapter>
);

export default ChapterTwo;