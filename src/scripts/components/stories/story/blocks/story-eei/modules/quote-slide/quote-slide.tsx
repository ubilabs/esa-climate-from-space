import { motion, useTransform } from "motion/react";
import ReactMarkdown from "react-markdown";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import ScrollModule from "../base-scroll/module/scroll-module";
import { useScrollModule } from "../base-scroll/use-scroll-module";

import config from "../../../../../../../config/main";

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

  const { scrollYProgress, config: animationConfig } =
    useScrollModule<QuoteSlideAnimationConfig>();

  return (
    <motion.div
      style={{
        opacity: useTransform(
          scrollYProgress,
          animationConfig.fadeIn.input,
          animationConfig.fadeIn.output,
        ),
      }}
    >
      <p>
        <ReactMarkdown
          children={module.quote?.text}
          allowedElements={config.markdownAllowedElements}
        />
      </p>
    </motion.div>
  );
}

export default function QuoteSlide() {
  const {
    module: { lengthFactor },
  } = useModuleContent();
  return (
    <ScrollModule
      className={styles.quoteWrapper}
      config={animationConfig}
      lengthFactor={lengthFactor}
    >
      <ScrollModule.StickyContainer className={styles.quote} isGrid>
        <QuoteContent />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
