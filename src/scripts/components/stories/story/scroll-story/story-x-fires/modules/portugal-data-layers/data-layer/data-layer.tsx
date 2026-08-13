import { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
  motion,
  MotionStyle,
  useMotionValueEvent,
  useTransform,
} from "motion/react";

import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";

import { useScrollModule } from "../../../../modules/base-scroll/use-scroll-module";
import { PortugalDataLayersAnimationConfig } from "../portugal-data-layers";

import styles from "./data-layer.module.css";

interface Props {
  layerNumber: 1 | 2 | 3 | 4;
  label: string;
}

export const DataLayer: FunctionComponent<Props> = (props) => {
  const { layerNumber, label } = props;
  const layerId = `layer${layerNumber}` as
    | "layer1"
    | "layer2"
    | "layer3"
    | "layer4";

  const { scrollYProgress, config } =
    useScrollModule<PortugalDataLayersAnimationConfig>();

  const imageUrls = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => {
        const dateTime = `2017-${String(index + 1).padStart(2, "0")}`;
        const fileName = `${layerId}_${dateTime}.webp`;
        const path = `assets/portugal-data-layers/${fileName}`;
        return getStoryAssetUrl("story-x-fires", path);
      }),
    [layerId],
  );

  // Preload all frames for the animation
  useEffect(() => {
    imageUrls.map((src) => {
      const image = new Image();
      image.src = src;
      return image;
    });
  }, [imageUrls]);

  const [showLabel, setShowLabel] = useState(false);
  const [imageUrlIndex, setImageUrlIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    setShowLabel(
      current > config[layerId].label.visibilityThreshold &&
        current < config.outro.perspective[0],
    );
  });

  const figureX = useTransform(
    scrollYProgress,
    config[layerId].figure.input,
    config[layerId].figure.output,
  );

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const index = config.timeline.timeThresholds.findIndex(
      (threshold) => progress < threshold,
    );

    setImageUrlIndex(index);
  });

  const perspectiveFactor = useTransform(
    scrollYProgress,
    config.outro.perspective,
    [1, 0],
  );
  const translateFactor = useTransform(
    scrollYProgress,
    config.outro.translate,
    [0, 1],
  );
  const scaleFactor = useTransform(scrollYProgress, config.outro.scale, [0, 1]);

  return (
    <motion.figure className={styles.layer} style={{ x: figureX }}>
      <motion.figcaption
        initial={{
          "--x-fires-layer-label-opacity": 0,
          "--x-fires-layer-label-connector-line-length": "0%",
          "--x-fires-layer-label-connector-dot-opacity": 0,
        }}
        animate={{
          "--x-fires-layer-label-opacity": showLabel ? 1 : 0,
          "--x-fires-layer-label-connector-line-length": showLabel
            ? "100%"
            : "0%",
          "--x-fires-layer-label-connector-dot-opacity": showLabel ? 1 : 0,
        }}
        transition={{
          ease: "easeInOut",
          duration: showLabel ? 0.2 : 0.1,
          "--x-fires-layer-label-opacity": {
            delay: showLabel ? 0 : 0.1,
          },
          "--x-fires-layer-label-connector-line-length": {
            delay: showLabel ? 0.2 : 0,
            duration: showLabel ? 0.2 : 0.1,
          },
          "--x-fires-layer-label-connector-dot-opacity": {
            delay: showLabel ? 0.4 : 0,
            duration: showLabel ? 0.2 : 0.1,
          },
        }}
      >
        <span>{label}</span>
      </motion.figcaption>
      <motion.img
        src={imageUrls[imageUrlIndex]}
        alt=""
        style={
          {
            "--x-fires-layer-number": layerNumber,
            "--x-fires-layer-image-perspective-factor": perspectiveFactor,
            "--x-fires-layer-image-translate-factor": translateFactor,
            "--x-fires-layer-image-scale-factor": scaleFactor,
          } as MotionStyle
        }
      />
    </motion.figure>
  );
};
