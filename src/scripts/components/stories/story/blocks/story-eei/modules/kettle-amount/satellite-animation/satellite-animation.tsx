import { motion, useTransform } from "motion/react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { KettleAmountAnimationConfig } from "../kettle-amount";

import { useStory } from "../../../../../../../../providers/story/use-story";
import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";

import styles from "./satellite-animation.module.css";

export default function SatelliteAnimation() {
  const { scrollYProgress, config } =
    useScrollModule<KettleAmountAnimationConfig>();

  const { story } = useStory();

  const storyId = story?.id;

  const assetUrl = getStoryAssetUrl(
    storyId ?? "",
    "assets/suomi-satellite-colored.png",
  );

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
      <img src={assetUrl} alt="Suomi satellite" />
    </motion.div>
  );
}
