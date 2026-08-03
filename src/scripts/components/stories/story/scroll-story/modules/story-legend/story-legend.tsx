import { useState } from "react";

import styles from "./story-image-legend.module.css";

const StoryLegend = () => {
  const [isLegendVisible, setIsLegendVisible] = useState(false);
  return (
    <div className={styles.legendContainer}>
      <button onClick={() => setIsLegendVisible((prev) => !prev)}>Info</button>
      {isLegendVisible && <figcaption>TEST</figcaption>}
    </div>
  );
};

export default StoryLegend;
