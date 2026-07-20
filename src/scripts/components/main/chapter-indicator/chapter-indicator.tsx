import { CSSProperties } from "react";
import styles from "./chapter-indicator.module.css";

interface Props {
  length: number;
}

const ChapterIndicator = ({ length }: Props) => {
  return (
    <nav className={styles.chapterIndicator}>
      <ol className={styles.dotContainer}>
        {Array.from({ length }, (_, index) => (
          <li
            style={
              {
                anchorName: `--dot-${index}`,
                "--anchor-start": `anchor(--dot-${index} end)`,
                "--anchor-end": `anchor(--dot-${index + 1} start)`,
              } as CSSProperties
            }
            className={styles.dot}
            key={index}
          ></li>
        ))}
      </ol>
    </nav>
  );
};

export default ChapterIndicator;
