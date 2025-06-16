import { FunctionComponent } from "react";
import cx from "classnames";

import styles from "./story-gallery-item.module.css";

interface Props {
  children: React.ReactNode[];
  currentIndex: number;
  showLightbox: boolean;
}

const StoryGalleryItem: FunctionComponent<Props> = ({
  children,
  currentIndex,
  showLightbox,
}) => {
  const containerWidthPercent = children.length * 100;
  // Width in percent of each gallery item
  const itemWidthPercent = 100 / children.length;
  const imgClasses = cx(
    styles.slider,
    showLightbox && styles.lightboxStoryGallery,
    children.length > 1 && styles.transition,
  );

  return (
    <div
      className={imgClasses}
      style={{
        width: `${containerWidthPercent}%`,
        transform: `translateX(-${itemWidthPercent * currentIndex}%)`,
      }}
    >
      {children.map((child, index) => (
        <div
          className={styles.sliderItem}
          key={index}
          style={{ width: `${itemWidthPercent}%` }}
        >
          <div className={styles.itemContainer}>{child}</div>
        </div>
      ))}
    </div>
  );
};

export default StoryGalleryItem;
