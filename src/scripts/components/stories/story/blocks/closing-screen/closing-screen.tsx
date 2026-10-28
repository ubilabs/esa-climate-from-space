import { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import { useStory } from "../../../../../providers/story/use-story";
import { useContentParams } from "../../../../../hooks/use-content-params";
import { useAppRouteFlags } from "../../../../../hooks/use-app-route-flags";

import { TextWrapper } from "../generic/text-container/text-wrapper";
import { ArrowUpIcon } from "../../../../main/icons/arrow-up-icon";
import { StorySectionProps } from "../../../../../types/story";

import cx from "classnames";

import styles from "./closing-screen.module.css";

export const ClosingScreen: FunctionComponent<StorySectionProps> = ({
  ref,
}) => {
  const { story, lenisRef } = useStory();

  const { category } = useContentParams();
  const { formatMessage } = useIntl();

  const { isScrollStory } = useAppRouteFlags();

  if (!story) {
    return null;
  }

  const message = formatMessage({ id: "exploreMoreInCategory" }, { category });

  return (
    <div
      style={{ backgroundColor: "#011e2b" }}
      ref={ref}
      className={cx(styles.closingScreen, "story-grid")}
    >
      <TextWrapper text={message} />
      {isScrollStory && (
        <button
          type="button"
          className={styles.toTop}
          onClick={() =>
            lenisRef.current?.scrollTo(0, {
              immediate: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches,
            })
          }
        >
          <span aria-hidden="true">
            <ArrowUpIcon />
          </span>
          {formatMessage({ id: "goBackToTop" })}
        </button>
      )}
    </div>
  );
};
