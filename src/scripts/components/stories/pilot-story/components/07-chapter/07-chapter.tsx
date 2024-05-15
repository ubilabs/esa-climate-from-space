import React, {FunctionComponent} from 'react';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';

import ChapterIntro from '../chapter-intro/chapter-intro';

import styles from './07-chapter.module.styl';

interface Props {
  onChapterSelect: () => void;
}

const ChapterSeven: FunctionComponent<Props> = ({
  onChapterSelect: setSelectedChapterIndex
}) => {
  const history = useHistory();

  const onHandleEnter = () => {
    history.replace('/stories/pilot/7');
    setSelectedChapterIndex();
  };

  return (
    <>
      <section className={styles.sectionContainer} data-scroll-index-6>
        <Parallax onEnter={onHandleEnter}>
          <ChapterIntro
            subTitle="Chapter 07: Methane Reduction Urgency"
            title="Strategic choices for our future"
          />
        </Parallax>
      </section>
    </>
  );
};

export default ChapterSeven;
