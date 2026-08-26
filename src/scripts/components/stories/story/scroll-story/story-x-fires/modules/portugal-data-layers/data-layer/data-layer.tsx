import { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
  motion,
  MotionStyle,
  useMotionValueEvent,
  useTransform,
} from "motion/react";

import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";
import { getCssVarPx } from "../../../../../../../../libs/get-css-var-in-px";
import { useScreenInfo } from "../../../../../../../../hooks/use-screen-info";

import { useScrollModule } from "../../../../modules/base-scroll/use-scroll-module";
import { useModuleContent } from "../../../../../../../../providers/story/module-content/use-module-content";
import { PortugalDataLayersAnimationConfig } from "../portugal-data-layers";
import { StoryXFiresModule } from "../../../../../../../../types/story";

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
  const { isDesktop, screenHeight, screenWidth } = useScreenInfo();

  const { module } = useModuleContent<StoryXFiresModule>();
  const imageUrls = useMemo(() => {
    // these layers don't have a time sequence, so we will only need to fetch the first frame
    const isLayer1or2 = layerId === "layer1" || layerId === "layer2";
    return Array.from({ length: 10 }, (_, index) => {
      const toBeIndexed = isLayer1or2 ? 0 : index;
      const dateTime = `2017-${String(toBeIndexed + 1).padStart(2, "0")}`;
      const fileName = `${layerId}_${dateTime}${isDesktop ? "_16x9" : ""}.webp`;
      const path = `${module.dataLayer.path}/${fileName}`;
      return getStoryAssetUrl("story-x-fires", path, { source: "cloud" });
    });
  }, [isDesktop, layerId, module.dataLayer.path]);

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

    setImageUrlIndex(index === -1 ? 9 : index);
  });

  const perspectiveFactor = useTransform(
    scrollYProgress,
    config.outro.perspective,
    [1, 0],
  );
  const rotation = useTransform(scrollYProgress, config.outro.perspective, [
    "62deg",
    "0deg",
  ]);
  const translateZ = useTransform(scrollYProgress, config.outro.translate, [
    `${layerNumber * 10}px`,
    "0px",
  ]);

  const layerOffset = useTransform(scrollYProgress, config.outro.translate, [
    `${(2.5 - layerNumber) * 5}rem`,
    "0rem",
  ]);

  const storyHeight = screenHeight - getCssVarPx("--header-height");
  const previewImageWidth = screenWidth * 0.37;
  const previewImageHeight =
    previewImageWidth * (isDesktop ? 720 / 1280 : 1280 / 720);

  const scaleX = useTransform(scrollYProgress, config.outro.scale, [0.3, 1]);
  const scaleY = useTransform(scrollYProgress, config.outro.scale, [
    previewImageHeight / storyHeight,
    1,
  ]);
  const translateX = useTransform(
    [perspectiveFactor, scaleX],
    ([perspective, imageScaleX]) =>
      `${Number(perspective) * Number(imageScaleX) * 25}%`,
  );
  const translateY = useTransform(
    [perspectiveFactor, scaleY],
    ([perspective, imageScaleY]) =>
      `${Number(perspective) * Number(imageScaleY) * -20}%`,
  );

  return (
    <motion.figure
      className={styles.layer}
      style={
        {
          x: figureX,
          zIndex: layerNumber,
          "--x-fires-layer-stack-offset": layerOffset,
        } as MotionStyle
      }
    >
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
            "--x-fires-layer-image-rotation": rotation,
            "--x-fires-layer-image-translate-x": translateX,
            "--x-fires-layer-image-translate-y": translateY,
            "--x-fires-layer-image-translate-z": translateZ,
            "--x-fires-layer-image-scale-x": scaleX,
            "--x-fires-layer-image-scale-y": scaleY,
          } as MotionStyle
        }
      />
    </motion.figure>
  );
};
