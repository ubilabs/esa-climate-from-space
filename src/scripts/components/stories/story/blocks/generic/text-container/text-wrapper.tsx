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

const getTranslateDistance = () => Math.min(window.innerHeight * 0.25, 200);

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

  const distance = getTranslateDistance();

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  // Slides in from left for even indices, from right for odd indices
  const translateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    index % 2 === 0 ? [-distance, 0, distance] : [distance, 0, -distance],
  );

  return (
    // The section is the stable layout container — its dimensions are never
    // affected by the animation, so content is never clipped or cut off.
    <section
      ref={ref}
      className={cx(styles.textWrapper, "story-grid", className)}
    >
      {/* Animation is applied to an inner element only, keeping the outer
          container's layout box stable and always occupying its full height. */}
      <motion.div
        className={styles.animationWrapper}
        style={{ opacity, y: translateY }}
      >
        <TextBlock
          text={text}
          refProp={refProp}
          hasRichText={hasRichText}
          storyId={storyId}
        />
      </motion.div>
    </section>
  );
};
