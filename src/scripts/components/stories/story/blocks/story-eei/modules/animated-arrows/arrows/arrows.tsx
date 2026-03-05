import { EEIArrow } from "../../../../../../../main/icons/eei-arrow";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { AnimatedArrowsConfig } from "../animated-arrows";

import styles from "./arrows.module.css";

export default function Arrows() {
  const { scrollYProgress, config } = useScrollModule<AnimatedArrowsConfig>();



  return (
    <div className={styles.arrows}>
      <EEIArrow variant="down" />
      <EEIArrow variant="up" />
    </div>
  );
}
