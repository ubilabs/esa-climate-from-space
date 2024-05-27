import React, {FunctionComponent} from 'react';

import ChapterIntro from '../chapter-intro/chapter-intro';
import Chapter from '../chapter/chapter';
import ChapterText from '../chapter-text/chapter-text';
import ChapterGraph from '../chapter-graph/chapter-graph';
import {graphContent} from '../../config/main';

interface Props {
  chapterIndex: number;
}

const ChapterSeven: FunctionComponent<Props> = ({chapterIndex}) => (
  <Chapter scrollIndex={chapterIndex}>
    <ChapterIntro
      flexPosition="flex-start"
      scrollIndex={chapterIndex}
      subTitle="Chapter 07: Methane Reduction Urgency"
      title="Strategic choices for our future"
    />
    <ChapterText text="The Paris Agreement is an international treaty aimed at combating climate change. It was adopted in 2015 and entered into force in 2016." />
    <ChapterText text="It outlines commitments by participating countries to reduce greenhouse gas emissions, adapt to the impacts of climate change, and provide support to developing nations in these efforts." />
    <ChapterText text="The central goal is to limit global warming to well below 2 degrees Celsius above pre-industrial levels, with efforts to further limit it to 1.5 degrees Celsius." />
    <ChapterGraph graph={graphContent} />
  </Chapter>
);

export default ChapterSeven;
