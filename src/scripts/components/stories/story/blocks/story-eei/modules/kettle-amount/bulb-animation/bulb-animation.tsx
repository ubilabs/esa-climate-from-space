import { motion, useTransform } from "motion/react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { KettleAmountAnimationConfig } from "../kettle-amount-types";
import { StoryEEIBulb } from "../../../../../../../main/icons/story-eei-bulb";
import styles from "./bulb-animation.module.css";

export default function BulbAnimation() {
  const { scrollYProgress, config } =
    useScrollModule<KettleAmountAnimationConfig>();

  return (
    <motion.div
      style={{
        y: useTransform(
          scrollYProgress,
          config.bulbExit.input,
          config.bulbExit.output,
        ),
      }}
      className={styles.bulbInfoContainer}
    >
      <div className={styles.bulbContainer}>
        <motion.span
          style={{
            opacity: useTransform(
              scrollYProgress,
              config.initial.bulbOpacity.input,
              config.initial.bulbOpacity.output,
            ),
          }}
        >
          <StoryEEIBulb isGlowing={true} />
        </motion.span>
        <motion.span>
          <StoryEEIBulb isGlowing={false} />
        </motion.span>
      </div>
      <span>Each square metre of Earth's surface retains 1.4 Watts.</span>
    </motion.div>
  );
}
