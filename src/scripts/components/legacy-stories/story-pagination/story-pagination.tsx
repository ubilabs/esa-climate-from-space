import { FunctionComponent, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import cx from "classnames";

import { PreviousIcon } from "../../main/icons/previous-icon";
import { NextIcon } from "../../main/icons/next-icon";
import { CloseIcon } from "../../main/icons/close-icon";

import styles from "./story-pagination.module.css";
import { useAppRouteFlags } from "../../../hooks/use-app-route-flags";

interface Props {
  slideIndex: number;
  storySlidesLength: number;
  nextSlideLink: string | null;
  previousSlideLink: string | null;
}

const StoryPagination: FunctionComponent<Props> = ({
  slideIndex,
  storySlidesLength,
  nextSlideLink,
  previousSlideLink,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { isShowCaseView, isPresentView } = useAppRouteFlags();

  // preserve location state search when navigating.
  const { state } = useLocation();
  const route = isShowCaseView ? "showcase" : isPresentView ? "present" : "";

  // add and remove event listener for keyboard events
  useEffect(() => {
    const onKeyDownHandler = (event: KeyboardEvent) => {
      if (!isShowCaseView) {
        const prevKeys = ["PageUp", "ArrowLeft", "ArrowUp"];
        const nextKeys = ["PageDown", "ArrowRight", "ArrowDown"];

        if (prevKeys.includes(event.key)) {
          if (previousSlideLink) {
            navigate(`/${previousSlideLink}`, {
              state,
            });
          }
        } else if (nextKeys.includes(event.key)) {
          if (nextSlideLink) {
            navigate(`/${nextSlideLink}`, {
              state,
            });
          }
        }
      } else if (event.key === "Escape") {
        navigate(`/${route}`, {
          state,
        });
      }
    };

    window.addEventListener("keydown", onKeyDownHandler);
    return () => {
      window.removeEventListener("keydown", onKeyDownHandler);
    };
  }, [
    isShowCaseView,
    navigate,
    nextSlideLink,
    previousSlideLink,
    route,
    state,
  ]);

  const disabledClasses = cx(
    styles.disabled,
    isShowCaseView && styles.emptyIcon,
  );

  return (
    <div className={styles.pagination}>
      <div className={styles.controls}>
        {previousSlideLink ? (
          <Link
            to={"/" + previousSlideLink}
            className={styles.icon}
            state={state}
          >
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
          <Link to={"/" + nextSlideLink} className={styles.icon} state={state}>
            <NextIcon />
          </Link>
        ) : (
          <div className={disabledClasses}>
            <NextIcon />
          </div>
        )}

        {isPresentView && (
          <div className={styles.closeIcon}>
            <Link
              to={"/present"}
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
