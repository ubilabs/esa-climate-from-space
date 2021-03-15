import React, {FunctionComponent, useState} from 'react';
import cx from 'classnames';

import {PreviousIcon} from '../../main/icons/previous-icon';
import {NextIcon} from '../../main/icons/next-icon';
import {FullscreenIcon} from '../../main/icons/fullscreen-icon';
import {getStoryAssetUrl} from '../../../libs/get-story-asset-urls';
import {useInterval} from '../../../hooks/use-interval';
import config from '../../../config/main';
import Caption from '../caption/caption';
import {CloseIcon} from '../../main/icons/close-icon';

import {StoryMode} from '../../../types/story-mode';

import styles from './story-gallery.styl';

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

        <div
          className={imgClasses}
          style={{
            width: `${containerWidth}%`,
            transform: `translateX(-${imageWidth * currentIndex}%)`
          }}>
          {images.map((image, index) => {
            const imageCaption = imageCaptions?.find((_, i) => i === index);
            const imageUrl = getStoryAssetUrl(storyId, image);

            return (
              <div
                className={styles.sliderImage}
                key={index}
                style={{width: `${imageWidth}%`}}>
                <div className={styles.imageContainer}>
                  <img className={styles.photo} src={imageUrl} />
                  {imageCaption && (
                    <Caption
                      className={cx(
                        styles.description,
                        showLightbox && styles.lightboxDescription
                      )}
                      content={imageCaption}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
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

export default StoryMedia;
