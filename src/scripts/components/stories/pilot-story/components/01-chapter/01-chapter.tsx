import React, {FunctionComponent, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';

import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText from '../chapter-text/chapter-text';

import styles from './01-chapter.module.styl';

interface Props {
  onChapterSelect: () => void;
}

const ChapterOne: FunctionComponent<Props> = ({
  onChapterSelect: setSelectedChapterIndex
}) => {
  const history = useHistory();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    entered && history.replace('/stories/pilot/1');
    setSelectedChapterIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered, history]);

  return (
    <>
      <section className={styles.sectionContainer}>
        <Parallax
          onEnter={() => setEntered(true)}
          onExit={() => setEntered(false)}>
          <ChapterIntro
            subTitle="Chapter 1: What is methane"
            title="The invisible threat"
          />
          <ChapterText text="Methane is a potent greenhouse gas, far more effective than carbon dioxide at trapping heat in the atmosphere over a 20-year period." />
          <ChapterText text="" />
          <ChapterText text="" />
        </Parallax>
      </section>
    </>
  );
};

export default ChapterOne;
