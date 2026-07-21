import { CSSProperties, useRef, useState } from "react";
import { motion, useAnimate } from "motion/react";
import styles from "./chapter-indicator.module.css";

interface Props {
  length: number;
}

const ChapterIndicator = ({ length }: Props) => {
  const [activeIndicator, setActiveIndicator] = useState<number>(0);
  const resolveLayoutAnimation = useRef<(() => void) | null>(null);
  const [scope, animate] = useAnimate();

  const variants = {
    initial: {
      width: "var(--dot-size)",
      height: "var(--dot-size)",
      mask: "radial-gradient(circle, transparent 0 0px, black 0px)",
    },
    animate: {
      width: "var(--indicator-size)",
      height: "var(--indicator-size)",
      mask: "radial-gradient(circle, transparent 0 var(--indicator-ring-offset), black var(--indicator-ring-offset))",
    },
  };

  const waitForLayoutAnimation = () => {
    // Finish any previous pending wait.
    resolveLayoutAnimation.current?.();

    return new Promise<void>((resolve) => {
      resolveLayoutAnimation.current = resolve;
    });
  };

  const completeLayoutAnimation = () => {
    const resolve = resolveLayoutAnimation.current;
    resolveLayoutAnimation.current = null;
    resolve?.();
  };

  const moveIndicatorTo = async (index: number) => {
    if (!scope.current) {
      return;
    }

    // create promise which pauses execution until resolved by onLayoutAnimationComplete callback
    const layoutFinished = waitForLayoutAnimation();

    // shrink indicator to dot size
    await animate(scope.current, variants.initial);

    // set active index triggering layout change
    setActiveIndicator(index);
    await layoutFinished;

    await animate(scope.current, variants.animate);
  };

  return (
    <motion.nav layoutRoot className={styles.chapterIndicator}>
      <ol className={styles.dotContainer}>
        {Array.from({ length }, (_, index) => (
          <li
            style={
              {
                anchorName: `--dot-${index}`,
                "--anchor-inset": `calc(anchor(--dot-${index} end) + var(--line-offset)) anchor(--dot-container center) calc(anchor(--dot-${index + 1} start) + var(--line-offset))`,
              } as CSSProperties
            }
            className={styles.dot}
            key={index}
          >
            <button
              type="button"
              className={styles.dotButton}
              aria-label={`Go to chapter ${index + 1}`}
              aria-current={index === activeIndicator ? "step" : undefined}
              onClick={() => moveIndicatorTo(index)}
            />
          </li>
        ))}

        <motion.span
          ref={scope}
          variants={variants}
          initial="animate"
          layout
          transition={{
            layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
          }}
          onLayoutAnimationComplete={completeLayoutAnimation}
          className={styles.activeIndicator}
          style={{
            positionAnchor: `--dot-${activeIndicator}`,
          }}
        ></motion.span>
      </ol>
    </motion.nav>
  );
};

export default ChapterIndicator;
