import React, {FunctionComponent, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';

import SatelliteCarousel from '../satellite-carousel/satellite-carousel';

import styles from './03-chapter.module.styl';
interface Props {
  onChapterSelect: () => void;
}

const ChapterThree: FunctionComponent<Props> = ({
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
        <Parallax onEnter={() => setEntered(true)}>
          <SatelliteCarousel />
        </Parallax>
      </section>
    </>
  );
};

export default ChapterThree;
