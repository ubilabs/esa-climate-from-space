import React, {FunctionComponent} from 'react';

import {ChapterSelectionHandler} from '../../types/globe';

import ChapterIntro from '../chapter-intro/chapter-intro';
import Chapter from '../chapter/chapter';

interface Props {
  onChapterSelect: ChapterSelectionHandler;
}

const ChapterSeven: FunctionComponent<Props> = ({onChapterSelect}) => (
  <Chapter scrollIndex={6} parallaxProps={onChapterSelect}>
    <ChapterIntro
      subTitle="Chapter 07: Methane Reduction Urgency"
      title="Strategic choices for our future"
    />
  </Chapter>
);

export default ChapterSeven;
