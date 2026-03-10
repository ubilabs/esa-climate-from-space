import { motion, useTransform } from "motion/react";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import ScrollModule from "../base-scroll/module/scroll-module";
import { QuoteSlideType } from "../../../../../../../types/story";
import { useScrollModule } from "../base-scroll/use-scroll-module";

import styles from "./quote-slide.module.css";

const animationConfig = {
  fadeIn: {
    input: [0, 0.3, 0.7, 1],
    output: [0, 1, 1, 0.8],
  },
};

export type QuoteSlideAnimationConfig = typeof animationConfig;

function QuoteContent() {
  const { module } = useModuleContent();

  const quoteSlide = module as QuoteSlideType;

  const { scrollYProgress, config } =
    useScrollModule<QuoteSlideAnimationConfig>();

  return (
    <motion.div
      style={{
        opacity: useTransform(
          scrollYProgress,
          config.fadeIn.input,
          config.fadeIn.output,
        ),
      }}
    >
      <p>{quoteSlide.quote?.text}</p>
      <span>{quoteSlide.quote?.author}</span>
    </motion.div>
  );
}

export default function QuoteSlide() {
  return (
    <ScrollModule className={styles.quoteWrapper} config={animationConfig}>
      <ScrollModule.Slide className={styles.quote}>
        <QuoteContent />
      </ScrollModule.Slide>
    </ScrollModule>
  );
}
