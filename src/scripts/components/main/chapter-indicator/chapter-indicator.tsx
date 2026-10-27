import { CSSProperties, Fragment } from "react";
import { motion, useTransform } from "motion/react";
import { MotionStyle } from "motion";

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
          } as MotionStyle
        }
      ></motion.span>
    </nav>
  );
};

export default ChapterIndicator;
