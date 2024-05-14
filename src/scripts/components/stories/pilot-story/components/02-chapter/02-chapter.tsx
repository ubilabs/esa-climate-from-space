import React, {FunctionComponent, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';

import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText from '../chapter-text/chapter-text';

import PilotCarousel from '../pilot-carousel/pilot-carousel';
import ExploreDataset from '../explore-dataset/explore-dataset';

import styles from './02-chapter.module.styl';

interface Props {
  onChapterSelect: () => void;
}

const ChapterTwo: FunctionComponent<Props> = ({
  onChapterSelect: setSelectedChapterIndex
}) => {
  const history = useHistory();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (entered) {
      history.replace('/stories/pilot/2');
      setSelectedChapterIndex();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered, history]);

  return (
    <>
      <section className={styles.sectionContainer}>
        <Parallax
          onEnter={() => setEntered(true)}
          onExit={() => setEntered(false)}>
          <ChapterIntro
            subTitle="Chapter 2: Methane Sources"
            title="Where does methane come from?"
          />
          <ChapterText text="Methane emissions arise from a multitude of sources, spanning both natural processes and human activities." />
          <ChapterText text="These sources contribute to the complex dynamics of methane concentrations in the atmosphere, playing a significant role in global climate change." />
          <ChapterText text="Understanding where methane comes from is essential for creating effective ways to reduce its harm to the environment and human health." />
          <PilotCarousel />
          <ExploreDataset />
          <ChapterText text="" />
        </Parallax>
      </section>
    </>
  );
};

export default ChapterTwo;
