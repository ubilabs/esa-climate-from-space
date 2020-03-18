import React, {FunctionComponent, useState} from 'react';
import cx from 'classnames';

import {PreviousIcon} from '../icons/previous-icon';
import {NextIcon} from '../icons/next-icon';
import {FullscreenExitIcon} from '../icons/fullscreen-exit-icon';
import {FullscreenIcon} from '../icons/fullscreen-icon';
import {getStoryMediaUrl} from '../../libs/get-story-media-url';

import styles from './story-media.styl';

interface Props {
  images: string[];
  storyId: string;
}

const StoryMedia: FunctionComponent<Props> = ({images, storyId}) => {
  const imagesLength = images.length;
  const containerWidth = imagesLength * 100;
  const imageWidth = 100 / imagesLength;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const showPrevButton = currentIndex > 0;
  const showNextButton = currentIndex < imagesLength - 1;

  const onPrevClick = () => {
    if (currentIndex <= 0) {
      return;
    }
    setCurrentIndex(currentIndex - 1);
  };

  const onNextClick = () => {
    if (currentIndex >= imagesLength - 1) {
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const imgClasses = cx(styles.slider, images.length > 1 && styles.transition);
  const galleryClasses = cx(
    styles.storyGallery,
    showLightbox && styles.lightboxGallery
  );

  return (
    <div className={styles.storyMedia}>
      <div className={galleryClasses}>
        <div className={styles.buttonContainer}>
          <div onClick={onPrevClick} className={styles.navIcon}>
            {showPrevButton ? <PreviousIcon /> : null}
          </div>
          <div onClick={onNextClick} className={styles.navIcon}>
            {showNextButton ? <NextIcon /> : null}
          </div>
        </div>
        {showLightbox ? (
          <div
            className={styles.fullscreenIcon}
            onClick={() => setShowLightbox(false)}>
            <FullscreenExitIcon />
          </div>
        ) : (
          <div
            className={styles.fullscreenIcon}
            onClick={() => setShowLightbox(true)}>
            <FullscreenIcon />
          </div>
        )}
        <div
          className={imgClasses}
          style={{
            width: `${containerWidth}%`,
            transform: `translateX(-${imageWidth * currentIndex}%)`
          }}>
          {images.map((image, index) => {
            const imageUrl = getStoryMediaUrl(storyId, image);
            return (
              <img
                className={styles.sliderImage}
                src={imageUrl}
                key={index}
                style={{width: `${imageWidth}%`}}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoryMedia;
