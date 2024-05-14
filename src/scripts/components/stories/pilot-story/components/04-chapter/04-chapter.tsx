import React, {FunctionComponent, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Parallax} from 'react-scroll-parallax';

import styles from './04-chapter.module.styl';
import RadialInfo from '../radial-info/radial-info';
import {RadialInfoOption} from '../01-chapter/01-chapter';

import imgSrc1 from '../../assets/01_sentinel.png';
import imgSrc2 from '../../assets/02_sentinel.png';
import imgSrc3 from '../../assets/03_sentinel.png';
import SatelliteIcon from '../icons/satellite-icon/satellite-icon';

interface Props {
  onChapterSelect: () => void;
}

const ChapterFour: FunctionComponent<Props> = ({
  onChapterSelect: setSelectedChapterIndex
}) => {
  const history = useHistory();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    entered && history.replace('/stories/pilot/2');
    setSelectedChapterIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered, history]);

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

  return (
    <>
      <section className={styles.sectionContainer}>
        <Parallax onEnter={() => setEntered(true)}>
          <RadialInfo
            options={options}
            title="The resolution is high enough to find individual sources of methane."
          />
        </Parallax>
      </section>
    </>
  );
};

export default ChapterFour;
