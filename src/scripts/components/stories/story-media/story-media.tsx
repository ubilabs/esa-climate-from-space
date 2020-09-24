import React, {FunctionComponent, useState} from 'react';
import cx from 'classnames';

import {PreviousIcon} from '../../main/icons/previous-icon';
import {NextIcon} from '../../main/icons/next-icon';
import {FullscreenExitIcon} from '../../main/icons/fullscreen-exit-icon';
import {FullscreenIcon} from '../../main/icons/fullscreen-icon';
import {getStoryMediaUrl} from '../../../libs/get-story-media-url';
import {useInterval} from '../../../hooks/use-interval';
import config from '../../../config/main';

import {StoryMode} from '../../../types/story-mode';

import styles from './story-media.styl';

interface Props {
  images: string[];
  imageCaptions?: string[];
  storyId: string;
  mode: StoryMode | null;
}

const StoryMedia: FunctionComponent<Props> = ({
  images,
  imageCaptions,
  storyId,
  mode
}) => {
  const containerWidth = images.length * 100;
  const imageWidth = 100 / images.length;
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
        {!showLightbox && (
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
            const imageCaption = imageCaptions?.find((_, i) => i === index);
            const imageUrl = getStoryMediaUrl(storyId, image);

            return (
              <div
                className={styles.sliderImage}
                key={index}
                style={{width: `${imageWidth}%`}}>
                <div className={styles.imageContainer}>
                  <img className={styles.photo} src={imageUrl} />
                  {showLightbox && (
                    <div className={styles.imageInfo}>
                      <p className={styles.description}>{imageCaption}</p>
                      <div
                        className={styles.fullscreenExitIcon}
                        onClick={() => setShowLightbox(false)}>
                        <FullscreenExitIcon />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoryMedia;
