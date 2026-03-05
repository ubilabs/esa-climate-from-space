import { motion, useTransform } from "motion/react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { SatelliteIcon } from "../../../../../../../main/icons/satellite-icon";
import { KettleAmountAnimationConfig } from "../kettle-amount";

import styles from "./satellite-animation.module.css";

export default function SatelliteAnimation() {
  const { scrollYProgress, config } =
    useScrollModule<KettleAmountAnimationConfig>();

  return (
    <motion.div
      className={styles.satellite}
      initial={{ x: "-10vw" }}
      style={{
        x: useTransform(
          scrollYProgress,
          config.satellite.xPosition.input,
          config.satellite.xPosition.output,
        ),
        opacity: useTransform(
          scrollYProgress,
          config.satellite.opacity.input,
          config.satellite.opacity.output,
        ),
      }}
    >
      <SatelliteIcon />
    </motion.div>
  );
}
