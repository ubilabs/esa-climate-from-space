import React, {FunctionComponent} from 'react';

import {RadialInfoOption} from '../01-chapter/01-chapter';
import RadialInfo from '../radial-info/radial-info';

import imgSrc1 from '../../assets/01_sentinel.png';
import imgSrc2 from '../../assets/02_sentinel.png';
import imgSrc3 from '../../assets/03_sentinel.png';

import {ChapterSelectionHandler} from '../../types/globe';

import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText from '../chapter-text/chapter-text';
import Chapter from '../chapter/chapter';
import SatelliteIcon from '../icons/satellite-icon/satellite-icon';

interface Props {
  onChapterSelect: ChapterSelectionHandler;
}

const options: RadialInfoOption[] = [
  {
    id: 'Sentinel-2',
    icon: <SatelliteIcon />,
    content: '200m',
    img: {
      src: imgSrc3,
      alt: 'Sentinel-5p satellite image of methane emissions in the atmosphere'
    }
  },
  {
    id: 'Sentinel-3',
    icon: <SatelliteIcon />,
    content: '2km',
    img: {
      src: imgSrc2,
      alt: 'Sentinel-5p satellite image of methane emissions in the atmosphere'
    }
  },
  {
    id: 'Sentinel-5p',
    icon: <SatelliteIcon />,
    content: '25km',
    img: {
      src: imgSrc1,
      alt: 'Sentinel-5p satellite image of methane emissions in the atmosphere'
    }
  }
];

const ChapterFour: FunctionComponent<Props> = ({onChapterSelect}) => (
  <Chapter scrollIndex={3} parallaxProps={onChapterSelect}>
    <ChapterIntro
      subTitle="Chapter 4: Mapping the Methane Giants"
      title="Resolution Matters"
    />
    <ChapterText text="What's special about the Sentinel Satellites is that they provide consistent high resolution data over time." />
    <RadialInfo
      options={options}
      title="The resolution is high enough to find individual sources of methane."
    />
    <ChapterText text="" />
  </Chapter>
);

export default ChapterFour;
