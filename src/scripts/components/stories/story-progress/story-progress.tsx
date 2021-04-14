import React, {FunctionComponent} from 'react';
import cx from 'classnames';

import styles from './story-progress.styl';

interface Props {
  images: string[];
  currentIndex: number;
  showLightbox: boolean;
}

const StoryProgress: FunctionComponent<Props> = ({
  images,
  currentIndex,
  showLightbox
}) => {
  const classes = cx(
    styles.progressContainer,
    showLightbox && styles.lightboxProgressContainer
  );

  return (
    <div className={classes}>
      <div className={styles.progress}>
        {images.map((_, index) => (
          <div
            key={index}
            className={cx(
              styles.progressItem,
              currentIndex === index && styles.currentProgress
            )}></div>
        ))}
      </div>
    </div>
  );
};

export default StoryProgress;
