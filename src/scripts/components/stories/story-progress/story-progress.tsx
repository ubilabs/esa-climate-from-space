import { FunctionComponent } from "react";
import cx from "classnames";

import styles from "./story-progress.module.css";

interface Props {
  children: React.ReactElement[];
  currentIndex: number;
  showLightbox: boolean;
}

const StoryProgress: FunctionComponent<Props> = ({
  children,
  currentIndex,
  showLightbox,
}) => {
  const classes = cx(
    styles.progressContainer,
    showLightbox && styles.lightboxProgressContainer,
  );

  return (
    <div className={classes}>
      <div className={styles.progress}>
        {children.map((_, index) => (
          <div
            key={index}
            className={cx(
              styles.progressItem,
              currentIndex === index && styles.currentProgress,
            )}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default StoryProgress;
