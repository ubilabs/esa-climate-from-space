import { FunctionComponent, useCallback, useEffect, useState } from "react";
import cx from "classnames";

import { PreviousIcon } from "../../main/icons/previous-icon";
import { NextIcon } from "../../main/icons/next-icon";
import { FullscreenIcon } from "../../main/icons/fullscreen-icon";

import { useInterval } from "../../../hooks/use-interval";
import { useAppRouteFlags } from "../../../hooks/use-app-route-flags";

import config from "../../../config/main";
import { CloseIcon } from "../../main/icons/close-icon";
import StoryGalleryItem from "../story-gallery-item/story-gallery-item";
import StoryProgress from "../story-progress/story-progress";

import styles from "./story-gallery.module.css";

interface Props {
  storyId: string;
  children: React.ReactElement[];
  showLightbox: boolean;
  setShowLightbox: (showLightbox: boolean) => void;
}

const StoryGallery: FunctionComponent<Props> = ({
  showLightbox,
  setShowLightbox,
  children,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const showPrevButton = currentIndex > 0;
  const showNextButton = currentIndex < children.length - 1;
  const {isShowCaseView} = useAppRouteFlags();
  const delay = isShowCaseView ? config.delay : null;

  useInterval(() => {
    if (isShowCaseView ) {
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
    [showLightbox, setShowLightbox],
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
      <div className={styles.gallery}>
        {!showLightbox ? (
          <div
            className={styles.fullscreenIcon}
            onClick={() => setShowLightbox(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                setShowLightbox(true);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <FullscreenIcon />
          </div>
        ) : (
          <div
            className={styles.fullscreenExitIcon}
            onClick={() => setShowLightbox(false)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                setShowLightbox(false);
              }
            }}
            role="button"
            tabIndex={0}
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
            <div
              onClick={onPrevClick}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  onPrevClick();
                }
              }}
              role="button"
              tabIndex={0}
              className={prevIconClasses}
            >
              <PreviousIcon />
            </div>
            <div
              onClick={onNextClick}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  onNextClick();
                }
              }}
              role="button"
              tabIndex={0}
              className={nextIconClasses}
            >
              <NextIcon />
            </div>
          </div>
        )}
      </div>
      {children.length > 1 && (
        <StoryProgress currentIndex={currentIndex} showLightbox={showLightbox}>
          {children}
        </StoryProgress>
      )}
    </div>
  );
};

export default StoryGallery;
