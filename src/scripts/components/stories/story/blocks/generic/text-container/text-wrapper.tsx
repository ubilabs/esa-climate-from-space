import { FunctionComponent, PropsWithChildren, useRef } from "react";
import { motion, useTransform } from "motion/react";
import cx from "classnames";

import { useStoryScroll } from "../../../../../../hooks/use-story-scroll";

import { TextBlock } from "./text-block/text-block";

import styles from "./text-wrapper.module.css";

interface TextWrapperProps extends PropsWithChildren {
  text: string;
  storyId?: string;
  className?: string;
  index?: number;
  refProp?: React.Ref<HTMLDivElement>;
  hasRichText?: boolean;
}

const TRANSLATE_DISTANCE = 300;

export const TextWrapper: FunctionComponent<TextWrapperProps> = ({
  refProp,
  text,
  storyId,
  index = 0,
  hasRichText,
  className,
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
      className={cx(styles.textWrapper, "story-grid", className)}
    >
      <TextBlock
        text={text}
        storyId={storyId}
        refProp={refProp}
        hasRichText={hasRichText}
      />
    </motion.section>
  );
};
