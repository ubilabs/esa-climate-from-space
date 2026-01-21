import { FunctionComponent, PropsWithChildren, useRef } from "react";
import { motion, useTransform } from "motion/react";
import cx from "classnames";

import { useStoryScroll } from "../../../../../../hooks/use-story-scroll";

import styles from "./text-container.module.css";

interface TextContainerProps extends PropsWithChildren {
  className?: string;
  index?: number;
}

const TRANSLATE_DISTANCE = 300;

export const TextContainer: FunctionComponent<TextContainerProps> = ({
  index = 0,
  className,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useStoryScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  const translateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    // For even indices, move left; for odd indices, move right
    index % 2 === 0
      ? [-TRANSLATE_DISTANCE, 0, TRANSLATE_DISTANCE]
      : [TRANSLATE_DISTANCE, 0, -TRANSLATE_DISTANCE],
  );

  return (
    <motion.section
      ref={ref}
      style={{
        opacity: opacity,
        translateY: translateY,
      }}
      className={cx(styles.textContainer, "story-grid", className)}
    >
      {children}
    </motion.section>
  );
};
