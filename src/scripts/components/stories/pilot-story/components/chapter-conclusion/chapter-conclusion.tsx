import React, {FunctionComponent, useEffect, useState} from 'react';
import {Parallax} from 'react-scroll-parallax';
import cx from 'classnames';

import Button from '../button/button';
import {ArrowBackIcon} from '../../../../main/icons/arrow-back-icon';
import {ArrowForwardIcon} from '../../../../main/icons/arrow-forward-icon';

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
}) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(progress >= 0.4 && progress <= 0.6);
  }, [progress]);

  return (
    <Parallax
      className={cx(styles.conclusion, visible && styles.visible)}
      onProgressChange={progress => setProgress(progress)}>
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
        icon={ArrowForwardIcon}
        id={styles.substoryButton}
        onClick={onNextStory}
      />
    </Parallax>
  );
};

export default ChapterConclusion;
