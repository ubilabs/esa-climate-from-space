import React, {FunctionComponent} from 'react';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';

import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText from '../chapter-text/chapter-text';
import Chapter from '../chapter/chapter';

interface Props {
  onChapterSelect: () => void;
}

const ChapterFive: FunctionComponent<Props> = ({
  onChapterSelect: setSelectedChapterIndex
}) => {
  const history = useHistory();

  const onHandleEnter = () => {
    history.replace('/stories/pilot/5');
    setSelectedChapterIndex();
  };

  return (
    <Chapter scrollIndex={4}>
      <Parallax onEnter={onHandleEnter}>
        <ChapterIntro
          subTitle="Chapter 5: Mapping the Methane Giants"
          title="Unveiling Methane Super Emitters"
        />
        <ChapterText text="The data is used to pinpoint individual regions and facilities emitting unusually high levels of methane, dubbed 'super emitters'." />
        <ChapterText text="Mapping these emissions not only helps enforce regulatory measures..." />
        <ChapterText text="but also guides companies and governments in prioritizing interventions to address methane emissions and mitigate their impact on the environment." />
        {/* explore dataset */}
        <ChapterText text="Space for globe" />
      </Parallax>
    </Chapter>
  );
};

export default ChapterFive;
