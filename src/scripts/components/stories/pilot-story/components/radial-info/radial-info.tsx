import React, {FunctionComponent, useState} from 'react';
import cx from 'classnames';

import {RadialInfoOption} from '../01-chapter/01-chapter';

import styles from './radial-info.module.styl';

interface Props {
  options: RadialInfoOption[];
  title: string;
}

const RadialInfo: FunctionComponent<Props> = ({options, title}) => {
  const [selectedOption, setSelectedOption] = useState<RadialInfoOption>(
    options[options.length - 1]
  );

  const positionElements = (index: number) => {
    const angle = Math.PI / 3 + (Math.PI / 3 / (options.length - 1)) * index;
    const radius = 250;
    const yPad = 50;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius - yPad;

    return {transform: `translate(${x}px, ${y}px)`};
  };

  return (
    <div className={styles.radialInfoContainer}>
      <h2>{title}</h2>

      <div className={styles.elements}>
        <div className={styles.selectedInner}>
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
  );
};

export default RadialInfo;
