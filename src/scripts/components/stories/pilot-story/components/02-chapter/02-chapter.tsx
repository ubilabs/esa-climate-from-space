import React, {FunctionComponent, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';

import ChapterIntro from '../chapter-intro/chapter-intro';

import PilotCarousel from '../pilot-carousel/pilot-carousel';

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
    entered && history.replace('/stories/pilot/2');
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
            subTitle="Chapter 2: What is methane"
            title="The invisible threat"
          />
          <PilotCarousel />
        </Parallax>
      </section>
    </>
  );
};

export default ChapterTwo;
