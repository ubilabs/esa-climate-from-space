import { FunctionComponent, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import cx from "classnames";

import { PreviousIcon } from "../../main/icons/previous-icon";
import { NextIcon } from "../../main/icons/next-icon";
import { CloseIcon } from "../../main/icons/close-icon";

import { RouteMatch } from "../../../types/story-mode";

import styles from "./story-pagination.module.css";

interface Props {
  mode: RouteMatch | null;
  slideIndex: number;
  storySlidesLength: number;
  nextSlideLink: string | null;
  previousSlideLink: string | null;
}

const StoryPagination: FunctionComponent<Props> = ({
  mode,
  slideIndex,
  storySlidesLength,
  nextSlideLink,
  previousSlideLink,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const isShowcaseMode = mode === RouteMatch.Showcase;
  const isPresenterMode = mode === RouteMatch.Present;

  const onKeyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      if (!isShowcaseMode) {
        // 37-arrow left, 33-page up, 38-arrow down
        if (
          event.keyCode === 33 ||
          event.keyCode === 37 ||
          event.keyCode === 38
        ) {
          if (previousSlideLink) {
            navigate(previousSlideLink);
          }
        }
        // 39-arrow right, 34-page down, 40-arrow down
        if (
          event.keyCode === 34 ||
          event.keyCode === 39 ||
          event.keyCode === 40
        ) {
          if (nextSlideLink) {
            navigate(nextSlideLink);
          }
        }
        // 27 - esc
      } else if (event.keyCode === 27) {
        navigate(`/${mode}`);
      }
    },
    [isShowcaseMode, navigate, mode, previousSlideLink, nextSlideLink],
  );

  // add and remove event listener for keyboard events
  useEffect(() => {
    window.addEventListener("keydown", onKeyDownHandler);
    return () => {
      window.removeEventListener("keydown", onKeyDownHandler);
    };
  }, [onKeyDownHandler]);

  const disabledClasses = cx(
    styles.disabled,
    isShowcaseMode && styles.emptyIcon,
  );

  return (
    <div className={styles.pagination}>
      <div className={styles.controls}>
        {previousSlideLink ? (
          <Link to={previousSlideLink} className={styles.icon}>
            <PreviousIcon />
          </Link>
        ) : (
          <div className={disabledClasses}>
            <PreviousIcon />
          </div>
        )}

        <span className={styles.slides}>
          {slideIndex + 1}/{storySlidesLength}
        </span>

        {nextSlideLink ? (
          <Link to={nextSlideLink} className={styles.icon}>
            <NextIcon />
          </Link>
        ) : (
          <div className={disabledClasses}>
            <NextIcon />
          </div>
        )}

        {isPresenterMode && (
          <div className={styles.closeIcon}>
            <Link
              to={`/${mode}`}
              title={intl.formatMessage({ id: "closeStory" })}
            >
              <CloseIcon />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryPagination;
