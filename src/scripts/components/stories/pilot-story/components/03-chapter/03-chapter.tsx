import React, {FunctionComponent} from 'react';

import {ChapterSelectionHandler} from '../../types/globe';

import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText from '../chapter-text/chapter-text';
import Chapter from '../chapter/chapter';
import SatelliteCarousel from '../satellite-carousel/satellite-carousel';

interface Props {
  onChapterSelect: ChapterSelectionHandler;
}

const ChapterThree: FunctionComponent<Props> = ({onChapterSelect}) => (
  <Chapter scrollIndex={2} parallaxProps={onChapterSelect}>
    <ChapterIntro
      subTitle="Chapter 3: ESA's Eyes in the Sky"
      title="ESA's Watchful Eyes Over Earth"
    />
    <ChapterText text="The European Space Agency employs cutting-edge satellite technology to monitor methane emissions from space." />
    <ChapterText text="Equipped with advanced spectrometry instruments, these satellites scan the Earth's surface to detect the unique spectral signature of methane. " />
    <ChapterText text="This allows scientists to gather data on methane concentrations globally and understand its sources and impact on climate change." />
    <SatelliteCarousel />
    <ChapterText text="This high-resolution detection enables scientists to monitor emissions over time, providing critical data that helps nations assess and adjust their environmental policies in real-time." />
  </Chapter>
);

export default ChapterThree;
