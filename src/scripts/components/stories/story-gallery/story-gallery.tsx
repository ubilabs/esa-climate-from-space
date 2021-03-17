import React, {FunctionComponent, useState} from 'react';
import cx from 'classnames';

import {PreviousIcon} from '../../main/icons/previous-icon';
import {NextIcon} from '../../main/icons/next-icon';
import {FullscreenIcon} from '../../main/icons/fullscreen-icon';
import {useInterval} from '../../../hooks/use-interval';
import config from '../../../config/main';
import {CloseIcon} from '../../main/icons/close-icon';
import StoryGalleryImage from '../story-gallery-image/story-gallery-image';

import {StoryMode} from '../../../types/story-mode';
import {ImageFit} from '../../../types/image-fit';

import styles from './story-gallery.styl';

interface Props {
  images: string[];
  imageCaptions?: string[];
  imageFits?: ImageFit[];
  storyId: string;
  mode: StoryMode | null;
}

const StoryGallery: FunctionComponent<Props> = ({
  images,
  imageCaptions,
  storyId,
  imageFits,
  mode
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const showPrevButton = currentIndex > 0;
  const showNextButton = currentIndex < images.length - 1;

  const delay = mode === StoryMode.Showcase ? config.delay : null;

  useInterval(() => {
    if (mode === StoryMode.Showcase) {
      if (currentIndex >= images.length - 1) {
        return;
      }
      setCurrentIndex(currentIndex + 1);
    }
  }, delay);

  const onPrevClick = () => {
    if (currentIndex <= 0) {
      return;
    }
    setCurrentIndex(currentIndex - 1);
  };

  const onNextClick = () => {
    if (currentIndex >= images.length - 1) {
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const storyGalleryClasses = cx(
    styles.storyGallery,
    showLightbox && styles.lightboxStoryGallery
  );
  const prevIconClasses = cx(
    styles.navIcon,
    !showPrevButton && styles.disabledNavIcon
  );
  const nextIconClasses = cx(
    styles.navIcon,
    !showNextButton && styles.disabledNavIcon
  );

  return (
    <div className={storyGalleryClasses}>
      <div className={styles.progressContainer}>
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
      <div className={styles.gallery}>
        {!showLightbox ? (
          <div
            className={styles.fullscreenIcon}
            onClick={() => setShowLightbox(true)}>
            <FullscreenIcon />
          </div>
        ) : (
          <div
            className={styles.fullscreenExitIcon}
            onClick={() => setShowLightbox(false)}>
            <CloseIcon />
          </div>
        )}
        <StoryGalleryImage
          images={images}
          imageCaptions={imageCaptions}
          storyId={storyId}
          imageFits={imageFits}
          currentIndex={currentIndex}
          showLightbox={showLightbox}
        />
        <div className={styles.buttonContainer}>
          <div onClick={onPrevClick} className={prevIconClasses}>
            <PreviousIcon />
          </div>
          <div onClick={onNextClick} className={nextIconClasses}>
            <NextIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryGallery;
