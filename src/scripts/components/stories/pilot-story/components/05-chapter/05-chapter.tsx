import React, {FunctionComponent} from 'react';

import {ChapterSelectionHandler} from '../../types/globe';

import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText from '../chapter-text/chapter-text';
import Chapter from '../chapter/chapter';
import ExploreDataset from '../explore-dataset/explore-dataset';

interface Props {
  onChapterSelect: ChapterSelectionHandler;
}

const ChapterFive: FunctionComponent<Props> = ({onChapterSelect}) => (
  <Chapter scrollIndex={4} parallaxProps={onChapterSelect}>
    <ChapterIntro
      subTitle="Chapter 5: Mapping the Methane Giants"
      title="Unveiling Methane Super Emitters"
    />
    <ChapterText text="The data is used to pinpoint individual regions and facilities emitting unusually high levels of methane, dubbed 'super emitters'." />
    <ChapterText text="Mapping these emissions not only helps enforce regulatory measures..." />
    <ChapterText text="but also guides companies and governments in prioritizing interventions to address methane emissions and mitigate their impact on the environment." />
    <ExploreDataset
      title="Find out where Methane Super Emitters are located."
      // TODO: Add data layer id wehen layer exists
      dataLayerId=""
    />
  </Chapter>
);

export default ChapterFive;
