import React, {FunctionComponent} from 'react';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';

import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText, {TextPageContent} from '../chapter-text/chapter-text';
import ChapterVideo from '../chapter-video/chapter-video';

import styles from './06-chapter.module.styl';

interface Props {
  onChapterSelect: () => void;
}

const textSections: TextPageContent[] = [
  {
    title: 'Incident Introduction',
    text: 'The Karaturun East Blowout of 2023 was a significant methane leak incident that occurred in a gas field located in Turkmenistan.',
    speed: 50,
    translate: [100, 10]
  },
  {
    title: 'Methane Release',
    text: 'It resulted from a blowout during gas extraction operations, leading to a substantial release of methane into the atmosphere.',
    speed: 100,
    translate: [100, 10]
  }
];

const ChapterSix: FunctionComponent<Props> = ({
  onChapterSelect: setSelectedChapterIndex
}) => {
  const history = useHistory();

  const onHandleEnter = () => {
    history.replace('/stories/pilot/5');
    setSelectedChapterIndex();
  };

  return (
    <>
      <section className={styles.sectionContainer} data-scroll-index-5>
        <Parallax onEnter={onHandleEnter}>
          <ChapterIntro
            subTitle="Chapter 6: Mapping the Methane Giants"
            title="10 largest methane leaks on record"
          />
          <ChapterText text="Space for Globe with markers" />
          <ChapterIntro
            subTitle="Methane Giant 01"
            title="Karaturun East Blowout 2023"
          />
          <ChapterText text={textSections} snapPosition="start" />
          <ChapterVideo videoId="TDsbPkms6P4" />
        </Parallax>
      </section>
    </>
  );
};

export default ChapterSix;
