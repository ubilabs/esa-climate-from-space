import { FunctionComponent, PropsWithChildren, ReactNode } from "react";

import cx from "classnames";

import styles from "./block-format-section.module.css";
import {
  Parallax,
  ParallaxProps,
  useParallaxController,
} from "react-scroll-parallax";
import { useStory } from "../../../../providers/story/use-story";

interface Props extends PropsWithChildren<ParallaxProps> {
  className?: string;
  children: ReactNode;
  index?: number;
}

export const indexAttribute = "data-index";
// let count = 0

export const FormatParallexLayout: FunctionComponent<Props> = ({
  children,
  className,
  index,
  ...parallaxProps
}) => {
  // const index = document.querySelectorAll(".test").length;

  // console.log("FormatParallexLayout index", index.length);
  // count++;
  // console.log("FormatParallexLayout count", count);
  const { setStorySlideIndex } = useStory();
  // const parallaxController = useParallaxController();
  return (
    <Parallax
      {...parallaxProps}
      data-index={index}
      rootMargin={{ top: -100, right: 0, bottom: -100, left: 0 }}
      onEnter={(pEl) => {
        const currentIndex = pEl.el.getAttribute(indexAttribute);
        if (currentIndex) {
          setStorySlideIndex(currentIndex);
        }
      }}
      className={cx(styles.formatSection, className, "test")}
    >
      {children}
    </Parallax>
  );
};
