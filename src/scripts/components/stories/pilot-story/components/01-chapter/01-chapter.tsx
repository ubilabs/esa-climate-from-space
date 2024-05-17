import React, {FunctionComponent} from 'react';
import {ReactElement} from 'react-markdown/lib/react-markdown';

import {BarrelIcon} from '../../../../main/icons/barrel-icon';
import {EyeIcon} from '../../../../main/icons/eye-icon';
import {NoseIcon} from '../../../../main/icons/nose-icon';
import {TreeIcon} from '../../../../main/icons/tree-icon';

import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText from '../chapter-text/chapter-text';
import Chapter from '../chapter/chapter';
import RadialInfo from '../radial-info/radial-info';

export interface RadialInfoOption {
  id: string;
  icon: ReactElement;
  content: string;
  img?: {
    src: string;
    alt: string;
  };
}

const options: RadialInfoOption[] = [
  {
    id: 'barrel',
    icon: <BarrelIcon />,
    content:
      'and is also produced by human activities such as agriculture and fossil fuel extraction.'
  },
  {
    id: 'tree',
    icon: <TreeIcon />,
    content: "It's found naturally in sources like swamps"
  },
  {
    id: 'nose',
    icon: <NoseIcon />,
    content: 'and odorless potent greenhouse gas.'
  },
  {
    id: 'eye',
    icon: <EyeIcon />,
    content: 'Methane, characterized as a colorless'
  }
];

interface Props {
  chapterIndex: number;
}

const ChapterOne: FunctionComponent<Props> = ({chapterIndex}) => (
  <Chapter scrollIndex={chapterIndex}>
    <ChapterIntro
      scrollIndex={chapterIndex}
      subTitle="Chapter 1: What is methane"
      title="The invisible threat"
    />
    <ChapterText
      text="Methane is a potent greenhouse gas, far more effective than carbon dioxide
          at trapping heat in the atmosphere over a 20-year period."
    />
    <RadialInfo
      options={options}
      title="Find out more about the greenhouse gas Methane."
    />
  </Chapter>
);

export default ChapterOne;
