import React, {FunctionComponent} from 'react';
import cx from 'classnames';

import styles from './story-gallery-item.module.styl';

interface Props {
  children: React.ReactNode[];
  currentIndex: number;
  showLightbox: boolean;
}

const StoryGalleryItem: FunctionComponent<Props> = ({
  children,
  currentIndex,
  showLightbox
}) => {
  const containerWidth = children.length * 100;
  const itemWidth = 100 / children.length;
  const imgClasses = cx(
    styles.slider,
    showLightbox && styles.lightboxStoryGallery,
    children.length > 1 && styles.transition
  );

  return (
    <div
      className={imgClasses}
      style={{
        width: `${containerWidth}%`,
        transform: `translateX(-${itemWidth * currentIndex}%)`
      }}>
      {children.map((child, index) => (
        <div
          className={styles.sliderItem}
          key={index}
          style={{width: `${itemWidth}%`}}>
          <div className={styles.itemContainer}>{child}</div>
        </div>
      ))}
    </div>
  );
};

export default StoryGalleryItem;
