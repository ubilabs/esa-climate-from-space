import { useRef } from "react";
import { motion, useMotionValueEvent, useTransform } from "motion/react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { KettleAmountAnimationConfig } from "../kettle-amount";
import { StoryEEIBulb } from "../../../../../../../main/icons/story-eei-bulb";

import styles from "./bulb-animation.module.css";

const getOpacity = (
  latest: number,
  input: number[],
  output: Array<string | number>,
) => {
  if (latest <= input[0]) {
    return Number(output[0]);
  }

  for (let index = 1; index < input.length; index++) {
    if (latest <= input[index]) {
      const startInput = input[index - 1];
      const endInput = input[index];
      const startOutput = Number(output[index - 1]);
      const endOutput = Number(output[index]);

      if (endInput === startInput) {
        return endOutput;
      }

      const progress = (latest - startInput) / (endInput - startInput);

      return startOutput + (endOutput - startOutput) * progress;
    }
  }

  return Number(output[output.length - 1]);
};

export default function BulbAnimation() {
  const { scrollYProgress, config } =
    useScrollModule<KettleAmountAnimationConfig>();
  const glowingBulbRef = useRef<HTMLSpanElement | null>(null);
  const text1Ref = useRef<HTMLSpanElement | null>(null);
  const text2Ref = useRef<HTMLSpanElement | null>(null);

  const syncOpacity = (latest: number) => {
    if (glowingBulbRef.current) {
      glowingBulbRef.current.style.opacity = getOpacity(
        latest,
        config.initial.bulbOpacity.input,
        config.initial.bulbOpacity.output,
      ).toString();
    }

    if (text1Ref.current) {
      text1Ref.current.style.opacity = getOpacity(
        latest,
        config.initial.text1.input,
        config.initial.text1.output,
      ).toString();
    }

    if (text2Ref.current) {
      text2Ref.current.style.opacity = getOpacity(
        latest,
        config.initial.text2.input,
        config.initial.text2.output,
      ).toString();
    }
  };

  // in chrome and safari, adding the opacity directly via the useTransform hook, does not work currently. This is a workaround
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    syncOpacity(latest);
  });

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
      <motion.div className={styles.bulbContainer}>
        <motion.span ref={glowingBulbRef}>
          <StoryEEIBulb isGlowing={true} />
        </motion.span>
        <motion.span>
          <StoryEEIBulb isGlowing={false} />
        </motion.span>
      </motion.div>
      <div className={styles.textContainer}>
        <motion.span
          ref={text1Ref}
          className={styles.bulbInfo}
          initial={{ opacity: 1 }}
        >
          Each square metre of Earth's surface retains 1.4 Watts.
        </motion.span>
        <motion.span
          ref={text2Ref}
          className={styles.bulbInfo}
          initial={{ opacity: 0 }}
        >
          It’s a tiny amount of power. Less than an LED light a nightlight.
        </motion.span>
      </div>
    </motion.div>
  );
}
