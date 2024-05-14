import React, {FunctionComponent, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';

import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText, {TextPageContent} from '../chapter-text/chapter-text';

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
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (entered) {
      history.replace('/stories/pilot/6');
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
            subTitle="Chapter 6: Mapping the Methane Giants"
            title="10 largest methane leaks on record"
          />
          <ChapterText text="Space for Globe with markers" />
          <ChapterIntro
            subTitle="Methane Giant 01"
            title="Karaturun East Blowout 2023"
          />
          <ChapterText text={textSections} snapPosition="start" />
        </Parallax>
      </section>
    </>
  );
};

export default ChapterSix;
