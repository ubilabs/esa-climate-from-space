import React, {FunctionComponent, useEffect, useState} from 'react';
import {ReactElement} from 'react-markdown/lib/react-markdown';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';

import ChapterIntro from '../chapter-intro/chapter-intro';
import ChapterText from '../chapter-text/chapter-text';
import RadialInfo from '../radial-info/radial-info';
import {EyeIcon} from '../../../../main/icons/eye-icon';
import {NoseIcon} from '../../../../main/icons/nose-icon';
import {TreeIcon} from '../../../../main/icons/tree-icon';
import {BarrelIcon} from '../../../../main/icons/barrel-icon';

import styles from './01-chapter.module.styl';

export interface RadialInfoOption {
  id: string;
  icon: ReactElement;
  content: string;
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
  onChapterSelect: () => void;
}

const ChapterOne: FunctionComponent<Props> = ({
  onChapterSelect: setSelectedChapterIndex
}) => {
  const history = useHistory();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    entered && history.replace('/stories/pilot/1');
    setSelectedChapterIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered, history]);

  return (
    <>
      <section className={styles.sectionContainer}>
        <Parallax
          onEnter={() => setEntered(true)}
          onExit={() => setEntered(false)}>
          <ChapterIntro
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
        </Parallax>
      </section>
    </>
  );
};

export default ChapterOne;
