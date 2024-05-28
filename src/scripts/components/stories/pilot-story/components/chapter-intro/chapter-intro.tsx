import React, {FunctionComponent, useEffect, useState} from 'react';
import {Parallax} from 'react-scroll-parallax';

import {ArrowBackIcon} from '../../../../main/icons/arrow-back-icon';
import ScrollHint from '../scroll-hint/scroll-hint';
import Button from '../button/button';
import SnapWrapper from '../snap-wrapper/snap-wrapper';

import {useScreenSize} from '../../../../../hooks/use-screen-size';

import {chapterIntroElement} from '../../config/main';

import cx from 'classnames';
import styles from './chapter-intro.module.styl';

interface Props {
  title: string;
  subTitle: string;
  scrollIndex: number;
  flexPosition?: 'flex-start' | 'flex-end';
  onBackToStory?: () => void;
  isSubChapter?: boolean;
}

const ChapterIntro: FunctionComponent<Props> = ({
  title,
  subTitle,
  scrollIndex,
  flexPosition,
  onBackToStory,
  isSubChapter
}) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const {isDesktop, isMobile} = useScreenSize();

  const hint = (
    <Parallax speed={-50} translateY={[-100, 100]} easing="easeOutQuad">
      <ScrollHint />
    </Parallax>
  );

  useEffect(() => {
    setVisible(progress >= 0.4 && progress <= 0.6);
  }, [progress]);

  return (
    <SnapWrapper>
      <>
        {onBackToStory && (
          <Button
            onClick={onBackToStory}
            icon={ArrowBackIcon}
            label="Back to Main Story"
            className={cx(styles.introBackButton, visible && styles.visible)}
            isBackButton
          />
        )}
        <Parallax
          className={cx(styles.intro, visible && styles.visible)}
          onProgressChange={progress => setProgress(progress)}>
          <div
            className={cx(styles.introContent)}
            style={{alignSelf: flexPosition}}>
            <h2
              className={cx(styles.subTitle, chapterIntroElement)}
              data-scroll-index-intro={scrollIndex}
              data-is-subchapter={isSubChapter}>
              {subTitle}
            </h2>

            <p className={styles.title}>{title}</p>
            {isDesktop && hint}
          </div>
        </Parallax>
        {isMobile && hint}
      </>
    </SnapWrapper>
  );
};

export default ChapterIntro;
