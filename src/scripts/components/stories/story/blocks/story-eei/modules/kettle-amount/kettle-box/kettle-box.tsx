import { motion, useTransform } from "motion/react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { KettleAmountAnimationConfig } from "../kettle-amount";
import KettleRow from "../kettle-row/kettle-row";
import YearSlider from "../year-slider/year-slider";
import SquareMeterLabel from "../square-meter-label/square-meter-label";
import SatelliteAnimation from "../satellite-animation/satellite-animation";

import styles from "./kettle-box.module.css";

export default function KettleBox() {
  const { scrollYProgress, config } =
    useScrollModule<KettleAmountAnimationConfig>();

  const scale = useTransform(
    scrollYProgress,
    config.initial.scale.input,
    config.initial.scale.output,
  );

  const y = useTransform(
    scrollYProgress,
    config.initial.yPosition.input,
    config.initial.yPosition.output,
  );

  const opacity = useTransform(
    scrollYProgress,
    config.initial.opacity.input,
    config.initial.opacity.output,
  );

  return (
    <div className={styles.boxContainer}>
      <motion.div className={styles.box} style={{ scale, y, opacity }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <KettleRow index={index} key={index} />
        ))}
        <SquareMeterLabel />
      </motion.div>
      <YearSlider />
    </div>
  );
}
