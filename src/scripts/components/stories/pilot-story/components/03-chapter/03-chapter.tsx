import React, {FunctionComponent} from 'react';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';

import SatelliteCarousel from '../satellite-carousel/satellite-carousel';
import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText from '../chapter-text/chapter-text';

import styles from './03-chapter.module.styl';
interface Props {
  onChapterSelect: () => void;
}

const ChapterThree: FunctionComponent<Props> = ({
  onChapterSelect: setSelectedChapterIndex
}) => {
  const history = useHistory();

  const onHandleEnter = () => {
    history.replace('/stories/pilot/3');
    setSelectedChapterIndex();
  };

  return (
    <>
      <section className={styles.sectionContainer} data-scroll-index-2>
        <Parallax onEnter={onHandleEnter}>
          <ChapterIntro
            subTitle="Chapter 3: ESA's Eyes in the Sky"
            title="ESA's Watchful Eyes Over Earth"
          />
          <ChapterText text="The European Space Agency employs cutting-edge satellite technology to monitor methane emissions from space." />
          <ChapterText text="Equipped with advanced spectrometry instruments, these satellites scan the Earth's surface to detect the unique spectral signature of methane. " />
          <ChapterText text="This allows scientists to gather data on methane concentrations globally and understand its sources and impact on climate change." />
          <SatelliteCarousel />
          <ChapterText text="This high-resolution detection enables scientists to monitor emissions over time, providing critical data that helps nations assess and adjust their environmental policies in real-time." />
          <ChapterText text="" />
        </Parallax>
      </section>
    </>
  );
};

export default ChapterThree;
