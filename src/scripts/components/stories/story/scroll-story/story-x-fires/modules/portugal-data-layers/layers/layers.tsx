import { motion, MotionStyle, useTransform } from "motion/react";

import { StoryXFiresModule } from "../../../../../../../../types/story";
import { useScreenInfo } from "../../../../../../../../hooks/use-screen-info";

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
  const { isDesktop } = useScreenInfo();
  const opacityFactor = useTransform(
    scrollYProgress,
    config.outro.fadeOut.input,
    config.outro.fadeOut.output,
  );
  const stackX = useTransform(
    scrollYProgress,
    config.layerStack.input,
    isDesktop ? config.layerStack.output : ["0vw", "0vw", "0vw"],
  );

  return (
    <motion.div
      className={styles.layers}
      style={
        {
          "--x-fires-layer-wrapper-opacity": opacityFactor,
          "--x-fires-layer-wrapper-x": stackX,
        } as MotionStyle
      }
    >
      <div className={styles.layerStack}>
        {([4, 3, 2, 1] as const).map((layerNumber) => (
          <DataLayer
            key={`portugal-data-layer-${layerNumber}`}
            layerNumber={layerNumber}
            label={content?.[`labelLayer${layerNumber}`] || ""}
          />
        ))}
      </div>
    </motion.div>
  );
}
