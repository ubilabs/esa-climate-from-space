import React, {FunctionComponent, useEffect, useState} from 'react';
import {Parallax} from 'react-scroll-parallax';
import cx from 'classnames';

import {RadialInfoOption} from '../01-chapter/01-chapter';
import SnapWrapper from '../snap-wrapper/snap-wrapper';

import styles from './radial-info.module.styl';

interface Props {
  options: RadialInfoOption[];
  title: string;
}

const RadialInfo: FunctionComponent<Props> = ({options, title}) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<RadialInfoOption>(
    options[options.length - 1]
  );

  useEffect(() => {
    setVisible(progress >= 0.4 && progress <= 0.5);
  }, [progress]);

  const positionElements = (index: number) => {
    const angle = Math.PI / 3 + (Math.PI / 3 / (options.length - 1)) * index;
    const radius = 250;
    const yPad = 50;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius - yPad;

    return {transform: `translate(${x}px, ${y}px)`};
  };

  const isSelectedImg =
    selectedOption?.img && Boolean('src' in selectedOption?.img);

  return (
    <SnapWrapper>
      <Parallax
        opacity={[0, 2]}
        speed={15}
        onProgressChange={progress => setProgress(progress)}
        style={{height: '100%'}}>
        <div className={styles.radialInfoContainer}>
          <h2>{title}</h2>
          <Parallax speed={-100}>
            <div className={cx(styles.elements, visible && styles.visible)}>
              <div className={styles.selectedInner}>
                {isSelectedImg ? (
                  <>
                    <img
                      src={selectedOption.img?.src}
                      alt={selectedOption.img?.alt}
                      className={styles.img}
                    />
                    <div>
                      <span>{selectedOption.id}</span>
                      <span>{selectedOption.content}</span>
                    </div>
                  </>
                ) : (
                  <p>{selectedOption.content}</p>
                )}
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
                  <div className={styles.optionInner}>{option.icon}</div>
                </div>
              ))}
            </div>
          </Parallax>
        </div>
      </Parallax>
    </SnapWrapper>
  );
};

export default RadialInfo;
