import { motion, MotionStyle, useTransform } from "motion/react";

import { StoryXFiresModule } from "../../../../../../../../types/story";

import { useScrollModule } from "../../../../modules/base-scroll/use-scroll-module";
import { DataLayer } from "../data-layer/data-layer";
import { PortugalDataLayersAnimationConfig } from "../portugal-data-layers";

import styles from "./layers.module.css";

interface Props {
  content: StoryXFiresModule["content"];
}

export function Layers({ content }: Props) {
  const { scrollYProgress, config } =
    useScrollModule<PortugalDataLayersAnimationConfig>();
  const opacityFactor = useTransform(
    scrollYProgress,
    config.outro.fadeOut.input,
    config.outro.fadeOut.output,
  );

  return (
    <motion.div
      className={styles.layers}
      style={
        {
          "--x-fires-layer-wrapper-opacity": opacityFactor,
        } as MotionStyle
      }
    >
      {([4, 3, 2, 1] as const).map((layerNumber) => (
        <DataLayer
          key={`portugal-data-layer-${layerNumber}`}
          layerNumber={layerNumber}
          label={content?.[`labelLayer${layerNumber}`] || ""}
        />
      ))}
    </motion.div>
  );
}
