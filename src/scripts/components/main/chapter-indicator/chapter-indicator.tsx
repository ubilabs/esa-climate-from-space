import { CSSProperties, Fragment } from "react";
import { motion, useTransform } from "motion/react";

import { useStoryScroll } from "../../../hooks/use-story-scroll";
import { useModuleScroll } from "../../../hooks/use-module-scroll";
import { useStory } from "../../../providers/story/use-story";

import styles from "./chapter-indicator.module.css";

const ChapterIndicator = () => {
  const { story, getModuleRefsMap } = useStory();

  const { heightFractionPerModule } = useModuleScroll();

  function scrollToNode(index: number) {
    const nodes = getModuleRefsMap();
    nodes.get(`${index}`)?.scrollIntoView({ behavior: "smooth" });
  }

  const { scrollYProgress } = useStoryScroll({});

  const top = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const transitionArea = 0.025;
  const fractionLength = heightFractionPerModule?.length ?? Infinity;

  // this makes the outer ring of the activeIndicator transform depending the current scroll
  // we dynamically generate input and output array to pass to useTransform
  const transformableHeightFractions = heightFractionPerModule?.reduce(
    (prev, fraction, index) => {
      //  handle first fraction
      if (index === 0) {
        return [
          [0, fraction + transitionArea],
          [1, 0],
        ];
      }

      // handle last fraction
      if (index === fractionLength - 1) {
        return [
          [...prev[0], fraction - transitionArea, fraction],
          [...prev[1], 0, 1],
        ];
      }

      return [
        [
          ...prev[0],
          fraction - transitionArea,
          fraction,
          fraction + transitionArea,
        ],
        [...prev[1], 0, 1, 0],
      ];
    },
    [] as Array<Array<number> | Array<number>>,
  ) ?? [[1], [1]];

  const ringScale = useTransform(
    scrollYProgress,
    transformableHeightFractions[0],
    transformableHeightFractions[1],
  );

  return (
    <nav key={story?.id} className={styles.chapterIndicator}>
      <ol className={styles.dotContainer}>
        {[...(heightFractionPerModule ?? [])]?.map((height, index) => {
          const lineEnd = (heightFractionPerModule?.[index + 1] ?? 0) * 100;

          return (
            <Fragment key={index}>
              <li
                style={
                  {
                    top: `${height * 100}%`,
                  } as CSSProperties
                }
                className={styles.dot}
              >
                <button
                  type="button"
                  className={styles.dotButton}
                  aria-label={`Go to chapter ${index + 1}`}
                  onClick={() => scrollToNode(index)}
                />
              </li>
              <span
                aria-hidden="true"
                className={styles.line}
                style={
                  {
                    "--line-start": `${height * 100}%`,
                    "--line-end": `${lineEnd}%`,
                  } as CSSProperties
                }
              ></span>
            </Fragment>
          );
        })}
      </ol>

      <motion.span
        className={styles.activeIndicator}
        style={
          {
            top,
            "--indicator-ring-scale": ringScale,
          } as unknown as CSSProperties
        }
      ></motion.span>
    </nav>
  );
};

export default ChapterIndicator;
