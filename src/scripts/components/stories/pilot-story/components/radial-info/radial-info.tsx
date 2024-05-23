import React, {FunctionComponent, useEffect, useState} from 'react';
import {Parallax} from 'react-scroll-parallax';
import cx from 'classnames';

import {RadialInfoOption} from '../01-chapter/01-chapter';
import SnapWrapper from '../snap-wrapper/snap-wrapper';
import {useScreenSize} from '../../../../../hooks/use-screen-size';

import styles from './radial-info.module.styl';

interface Props {
  options: RadialInfoOption[];
  title: string;
}

const RadialInfo: FunctionComponent<Props> = ({options, title}) => {
  const {isDesktop} = useScreenSize();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<RadialInfoOption>(
    options[options.length - 1]
  );

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const radius = Math.max(130, Math.min(windowWidth / 4, 220));

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setVisible(progress >= 0.4 && progress <= 0.6);
  }, [progress]);

  const positionElements = (index: number) => {
    const angleMultiplier = isDesktop ? 1.75 : 2.25;
    const angle =
      Math.PI * angleMultiplier + (Math.PI / 2 / (options.length - 1)) * index;

    const xPad = isDesktop ? 100 : 60;
    const yPad = isDesktop ? 80 : 80;
    const x = Math.cos(angle) * (radius + xPad);
    const y = Math.sin(angle) * (radius + yPad);

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
        style={{height: '100%'}}
        className={styles.radialInfoContainer}>
        <h2>{title}</h2>
        <Parallax speed={-100}>
          <div
            className={cx(styles.elements, visible && styles.visible)}
            style={{width: radius * 2, height: radius * 2}}>
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
      </Parallax>
    </SnapWrapper>
  );
};

export default RadialInfo;
