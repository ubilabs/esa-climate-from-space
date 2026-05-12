import {
  motion,
  useAnimate,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { quantize } from "../../../../../../../../libs/quantize";

import { useStory } from "../../../../../../../../providers/story/use-story";
import { useStoryScroll } from "../../../../../../../../hooks/use-story-scroll";
import { useScreenInfo } from "../../../../../../../../hooks/use-screen-info";
import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";

import styles from "./satellite-animation.module.css";

const config = {
  xPosition: {
    scrollReset: 0.28,
    scrollStart: 0.48,
    initial: 0,
  },
  opacity: {
    input: [0, 0.28, 0.3, 0.88, 0.9],
    output: ["0", "0", "1", "1", "0"],
  },
};

export default function SatelliteAnimation() {
  const { scrollYProgress } = useStoryScroll({});

  const { story } = useStory();

  const storyId = story?.id;

  const assetUrl = getStoryAssetUrl(
    storyId ?? "",
    "assets/suomi-satellite-colored.png",
  );
  const [scope, animate] = useAnimate();

  // const { isMobile } = useScreenInfo();

  const opacity = useTransform(
    scrollYProgress,
    config.opacity.input,
    config.opacity.output,
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("🚀 ~ satellite-animation.tsx:27 → latest:", latest, opacity);
    // make sure animation restarts
    // if (latest < config.xPosition.scrollReset) {
    //   animate(
    //     scope.current,
    //     { x: config.xPosition.initial, y: "0px" },
    //     { duration: 0 },
    //   );
    // }

    // if (quantize(latest, 0.01) === config.xPosition.scrollStart) {
    //   animate(scope.current, { x: "50vw" }, { duration: isMobile ? 10 : 16 });
    // }
  });

  return (
    <motion.div
      ref={scope}
      className={styles.satellite}
      initial={{ x: config.xPosition.initial }}
      style={{
        opacity: useTransform(
          scrollYProgress,
          config.opacity.input,
          config.opacity.output,
        ),
      }}
    >
      <img src={assetUrl} alt="Suomi satellite" />
    </motion.div>
  );
}
