import { FunctionComponent, useCallback, useEffect, useState } from "react";
import cx from "classnames";

import { PreviousIcon } from "../../main/icons/previous-icon";
import { NextIcon } from "../../main/icons/next-icon";
import { FullscreenIcon } from "../../main/icons/fullscreen-icon";
import { useInterval } from "../../../hooks/use-interval";
import config from "../../../config/main";
import { CloseIcon } from "../../main/icons/close-icon";
import StoryGalleryItem from "../story-gallery-item/story-gallery-item";
import StoryProgress from "../story-progress/story-progress";

import { StoryMode } from "../../../types/story-mode";

import styles from "./story-gallery.module.css";

interface Props {
  storyId: string;
  mode: StoryMode | null;
  children: React.ReactElement[];
  showLightbox: boolean;
  setShowLightbox: (showLightbox: boolean) => void;
}

const StoryGallery: FunctionComponent<Props> = ({
  mode,
  showLightbox,
  setShowLightbox,
  children,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const showPrevButton = currentIndex > 0;
  const showNextButton = currentIndex < children.length - 1;
  const delay = mode === StoryMode.Showcase ? config.delay : null;

  useInterval(() => {
    if (mode === StoryMode.Showcase) {
      if (currentIndex >= children.length - 1) {
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
    if (currentIndex >= children.length - 1) {
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  // close fullscreen gallery on esc
  const onKeyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      if (showLightbox) {
        // 27 - esc
        if (event.keyCode === 27) {
          setShowLightbox(false);
        }
      }
    },
    [showLightbox],
  );

  // add and remove event listener for keyboard events
  useEffect(() => {
    window.addEventListener("keydown", onKeyDownHandler);
    return () => {
      window.removeEventListener("keydown", onKeyDownHandler);
    };
  }, [onKeyDownHandler]);

  const storyGalleryClasses = cx(
    styles.storyGallery,
    showLightbox && styles.lightboxStoryGallery,
  );
  const prevIconClasses = cx(
    styles.navIcon,
    !showPrevButton && styles.disabledNavIcon,
  );
  const nextIconClasses = cx(
    styles.navIcon,
    !showNextButton && styles.disabledNavIcon,
  );

  return (
    <div className={storyGalleryClasses}>
      {children.length > 1 && (
        <StoryProgress currentIndex={currentIndex} showLightbox={showLightbox}>
          {children}
        </StoryProgress>
      )}
      <div className={styles.gallery}>
        {!showLightbox ? (
          <div
            className={styles.fullscreenIcon}
            onClick={() => setShowLightbox(true)}
          >
            <FullscreenIcon />
          </div>
        ) : (
          <div
            className={styles.fullscreenExitIcon}
            onClick={() => setShowLightbox(false)}
          >
            <CloseIcon />
          </div>
        )}
        <StoryGalleryItem
          currentIndex={currentIndex}
          showLightbox={showLightbox}
        >
          {children}
        </StoryGalleryItem>
        {children.length > 1 && (
          <div className={styles.buttonContainer}>
            <div onClick={onPrevClick} className={prevIconClasses}>
              <PreviousIcon />
            </div>
            <div onClick={onNextClick} className={nextIconClasses}>
              <NextIcon />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryGallery;
