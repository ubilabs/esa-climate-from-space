import React, {FunctionComponent} from 'react';
import cx from 'classnames';

import {getStoryAssetUrl} from '../../../libs/get-story-asset-urls';
import Caption from '../caption/caption';

import {ImageFit} from '../../../types/image-fit';

import styles from './story-gallery-image.styl';

interface Props {
  images: string[];
  imageCaptions?: string[];
  imageFits?: ImageFit[];
  storyId: string;
  currentIndex: number;
  showLightbox: boolean;
}

const StoryGalleryImage: FunctionComponent<Props> = ({
  images,
  imageCaptions,
  storyId,
  imageFits,
  currentIndex,
  showLightbox
}) => {
  const containerWidth = images.length * 100;
  const imageWidth = 100 / images.length;
  const imgClasses = cx(
    styles.slider,
    showLightbox && styles.lightboxStoryGallery,
    images.length > 1 && styles.transition
  );

  return (
    <div
      className={imgClasses}
      style={{
        width: `${containerWidth}%`,
        transform: `translateX(-${imageWidth * currentIndex}%)`
      }}>
      {images.map((image, index) => {
        const imageCaption = imageCaptions?.find((_, i) => i === index);
        const imageType = imageFits?.find((_, i) => i === index);
        const imageUrl = getStoryAssetUrl(storyId, image);

        return (
          <div
            className={styles.sliderImage}
            key={index}
            style={{width: `${imageWidth}%`}}>
            <div className={styles.imageContainer}>
              <img
                className={styles.photo}
                style={{
                  objectFit:
                    imageType === ImageFit.Contain ? 'contain' : 'cover'
                }}
                src={imageUrl}
              />
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
  );
};

export default StoryGalleryImage;
