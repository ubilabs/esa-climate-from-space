import React, {FunctionComponent, useEffect, useState} from 'react';
import {Parallax} from 'react-scroll-parallax';
import cx from 'classnames';

import {RadialInfoOption} from '../01-chapter/01-chapter';

import styles from './radial-info.module.styl';

interface Props {
  options: RadialInfoOption[];
  title: string;
}

const RadialInfo: FunctionComponent<Props> = ({options, title}) => {
  const [progress, setProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedOption, setSelectedOption] = useState<RadialInfoOption>(
    options[options.length - 1]
  );

  useEffect(() => {
    setShowInfo(progress > 0.54 ? true : false);
  }, [progress]);

  const positionElements = (index: number) => {
    const angle = Math.PI / 3 + (Math.PI / 3 / (options.length - 1)) * index;
    const radius = 250;
    const yPad = 50;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius - yPad;

    return {transform: `translate(${x}px, ${y}px)`};
  };

  return (
    <Parallax
      opacity={[0, 2]}
      speed={-5}
      onProgressChange={progress => setProgress(progress)}>
      <div className={styles.radialInfoContainer}>
        <h2>{title}</h2>
        <div className={styles.elements}>
          <div
            className={styles.selectedInner}
            style={{opacity: `${showInfo ? 1 : 0}`}}>
            <p>{selectedOption.content}</p>
          </div>
          {options.map((option, index) => (
            <div
              onMouseOver={() => setSelectedOption(option)}
              className={cx(
                styles.option,
                selectedOption === option && styles.selected
              )}
              key={option.id}
              style={positionElements(index)}>
              <div className={styles.optionInner}> {option.icon}</div>
            </div>
          ))}
        </div>
      </div>
    </Parallax>
  );
};

export default RadialInfo;
