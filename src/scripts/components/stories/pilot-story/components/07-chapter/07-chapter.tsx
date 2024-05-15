import React, {FunctionComponent} from 'react';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';

import ChapterIntro from '../chapter-intro/chapter-intro';
import Chapter from '../chapter/chapter';

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
    <Chapter scrollIndex={6}>
      <Parallax onEnter={onHandleEnter}>
        <ChapterIntro
          subTitle="Chapter 07: Methane Reduction Urgency"
          title="Strategic choices for our future"
        />
      </Parallax>
    </Chapter>
  );
};

export default ChapterSeven;
