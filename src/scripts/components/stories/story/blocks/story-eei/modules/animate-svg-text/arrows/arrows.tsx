import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { AnimateSVGTextConfig } from "../animate-svg-text";

import styles from "./arrows.module.css"

export default function Arrows() {
  const { scrollYProgress, config } = useScrollModule<AnimateSVGTextConfig>();
  console.log("🚀 ~ arrows.tsx:7 → scrollYProgress:", scrollYProgress);
  console.log("🚀 ~ arrows.tsx:7 → config:", config);
  return <div className={styles.arrows}></div>;
}
