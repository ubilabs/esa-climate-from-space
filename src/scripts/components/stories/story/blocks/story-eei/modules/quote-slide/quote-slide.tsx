import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import { StoryEEIModule } from "../../../../../../../types/story";
import ScrollModule from "../base-scroll/module/scroll-module";

import styles from "./quote-slide.module.css";

const animationConfig = {};

export default function QuoteSlide() {
  const { module } = useModuleContent();
  const quoteModule = module as StoryEEIModule;

  return (
    <ScrollModule className={styles.quoteWrapper} config={animationConfig}>
      <ScrollModule.Slide className={styles.quote}>
        <p>{quoteModule.quote?.text}</p>
        <span className={styles.quote}>{quoteModule.quote?.author}</span>
      </ScrollModule.Slide>
    </ScrollModule>
  );
}
