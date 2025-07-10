import { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { SLIDE_INDEX_ATTRIBUTE } from "../../../../config/main";
import { Parallax, ParallaxProps } from "react-scroll-parallax";

import { useStory } from "../../../../providers/story/use-story";
import { getUpdatedStoryUrl } from "../../../../libs/get-updated-story-url";

import cx from "classnames";
import styles from "./block-format-section.module.css";

interface Props extends PropsWithChildren<ParallaxProps> {
  className?: string;
  children: ReactNode;
  index?: number;
}

export const FormatParallaxLayout: FunctionComponent<Props> = ({
  children,
  className,
  index,
  ...parallaxProps
}) => {
  const { hasInitialScrolled } = useStory();

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Parallax
      {...parallaxProps}
      {...{ [SLIDE_INDEX_ATTRIBUTE]: index }}
      rootMargin={{ top: -100, right: 0, bottom: -100, left: 0 }}
      onEnter={(pEl) => {
        const currentIndex = pEl.el.getAttribute(SLIDE_INDEX_ATTRIBUTE);

        if (!currentIndex) {
          console.warn(
            `FormatParallaxElement ${pEl.id}: Missing index attribute on element. Will not update url`,
          );
          return;
        }

        const newUrl = getUpdatedStoryUrl(
          location.pathname,
          Number(currentIndex),
        );

        // Prevent URL before the initial scroll has not finished
        if (hasInitialScrolled.current) {
          navigate(newUrl);
        }
      }}
      className={cx(styles.formatSection, className)}
    >
      {children}
    </Parallax>
  );
};
