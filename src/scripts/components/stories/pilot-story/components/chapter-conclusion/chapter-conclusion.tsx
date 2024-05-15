import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';

import SnapWrapper from '../snap-wrapper/snap-wrapper';
import Button from '../button/button';
import {ArrowBackIcon} from '../../../../main/icons/arrow-back-icon';

import styles from './chapter-conclusion.module.styl';

interface Props {
  text: string;
  onBackToStory: () => void;
  onNextStory: () => void;
}

const ChapterConclusion: FunctionComponent<Props> = ({
  text,
  onBackToStory,
  onNextStory
}) => (
  <SnapWrapper className={styles.conclusion}>
    <Button
      isBackButton
      label="Back To Story"
      icon={ArrowBackIcon}
      onClick={onBackToStory}
    />
    <Parallax className={styles.chapterText} opacity={[0, 2]}>
      <p>{text}</p>
    </Parallax>
    <Button
      isBackButton
      label="Next Giant"
      icon={ArrowBackIcon}
      id={styles.substoryButton}
      onClick={onNextStory}
    />
  </SnapWrapper>
);

export default ChapterConclusion;
