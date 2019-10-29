import React, {FunctionComponent, useState} from 'react';

import {BackIcon} from '../icons/back-icon';
import {NextIcon} from '../icons/next-icon';

import styles from './story-gallery.styl';

interface Props {
  images: [];
}

const StoryGallery: FunctionComponent<Props> = ({images}) => {
  const imagesLength = images.length;
  const containerWidth = imagesLength * 100;
  const imageWidth = 100 / imagesLength;
  const [currentIndex, setCurrentIndex] = useState(0);
  const showBackButton = currentIndex > 0;
  const showNextButton = currentIndex < imagesLength - 1;

  const onBackClick = () => {
    if (currentIndex <= 0) {
      return null;
    }
    return setCurrentIndex(currentIndex - 1);
  };

  const onNextClick = () => {
    if (currentIndex >= imagesLength - 1) {
      return null;
    }
    return setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className={styles.storyGallery}>
      <div className={styles.buttonContainer}>
        <div onClick={onBackClick}>{showBackButton ? <BackIcon /> : null}</div>
        <div onClick={onNextClick}>{showNextButton ? <NextIcon /> : null}</div>
      </div>
      <div
        className={styles.slider}
        style={{
          width: `${containerWidth}%`,
          transform: `translateX(-${imageWidth * currentIndex}%)`,
          transition: 'transform ease-out 0.50s'
        }}>
        {images.map((image, index) => (
          <img
            className={styles.sliderImage}
            src={image}
            alt="img"
            key={index}
            style={{width: `${imageWidth}%`}}
          />
        ))}
      </div>
    </div>
  );
};

export default StoryGallery;
