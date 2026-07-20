import { CSSProperties, useState } from "react";
import { motion } from "motion/react";
import styles from "./chapter-indicator.module.css";

interface Props {
  length: number;
}

const ChapterIndicator = ({ length }: Props) => {
  const [activeIndicator, setActiveIndicator] = useState<number>(0);
  console.log(
    "🚀 ~ chapter-indicator.tsx:11 → activeIndicator:",
    activeIndicator,
  );
  return (
    <nav className={styles.chapterIndicator}>
      <ol className={styles.dotContainer}>
        {Array.from({ length }, (_, index) => (
          <li
            onClick={() => setActiveIndicator(index)}
            style={
              {
                anchorName: `--dot-${index}`,
                "--anchor-inset": `calc(anchor(--dot-${index} end) + var(--line-offset)) anchor(--dot-container center) calc(anchor(--dot-${index + 1} start) + var(--line-offset))`,
              } as CSSProperties
            }
            className={styles.dot}
            key={index}
          ></li>
        ))}
        <motion.span
          layout
          className={styles.activeIndicator}
          style={{
            positionAnchor: `--dot-${activeIndicator}`,
          }}
        ></motion.span>
      </ol>
    </nav>
  );
};

export default ChapterIndicator;
