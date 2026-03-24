import {
  motion,
  useAnimate,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { quantize } from "../../../../../../../../libs/quantize";
import { KettleAmountAnimationConfig } from "../kettle-amount";

import { useStory } from "../../../../../../../../providers/story/use-story";
import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";

import styles from "./satellite-animation.module.css";

export default function SatelliteAnimation() {
  const { scrollYProgress, config } =
    useScrollModule<KettleAmountAnimationConfig>();

  const [scope, animate] = useAnimate();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.1) {
      animate(
        scope.current,
        { x: config.satellite.xPosition.initial, y: "0px" },
        { duration: 0 },
      );
    }

    if (quantize(latest, 0.01) === config.satellite.xPosition.scrollStart) {
      animate(scope.current, { x: "50vw" }, { duration: 10 });
    }
  });

  const { story } = useStory();

  const storyId = story?.id;

  const assetUrl = getStoryAssetUrl(
    storyId ?? "",
    "assets/suomi-satellite-colored.png",
  );

  return (
    <motion.div
      ref={scope}
      className={styles.satellite}
      initial={{ x: config.satellite.xPosition.initial }}
      style={{
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
