import React, {FunctionComponent, useState, useEffect} from 'react';
import cx from 'classnames';

import {PreviousIcon} from '../icons/back-icon';
import {NextIcon} from '../icons/next-icon';
import {FullscreenIcon} from '../icons/fullscreen-icon';
import {FullscreenExitIcon} from '../icons/fullscreen-exit-icon';

import styles from './story-gallery.styl';

interface Props {
  images: string[];
  fullscreenGallery?: boolean;
}

const StoryGallery: FunctionComponent<Props> = ({
  images,
  fullscreenGallery
}) => {
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

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const imgClasses = cx([
    styles.slider,
    images.length > 1 && styles.transition
  ]);

  const lightboxClasses = cx([
    showLightbox && styles.lightbox,
    fullscreenGallery && styles.fullscreen
  ]);

  const galleryClasses = cx([
    styles.storyGallery,
    showLightbox && styles.lightboxGallery
  ]);

  return (
    <div className={lightboxClasses}>
      <div className={galleryClasses}>
        <div className={styles.buttonContainer}>
          <div onClick={onPrevClick}>
            {showPrevButton ? <PreviousIcon /> : null}
          </div>
          <div onClick={onNextClick}>
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
          {images.map((image, index) => (
            <img
              className={styles.sliderImage}
              src={image}
              key={index}
              style={{width: `${imageWidth}%`}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryGallery;
