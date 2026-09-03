import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import { StoryMarkdown } from "../../../../../../shared/story-markdown/story-markdown";
import ImageCarousel from "../../../../blocks/image-gallery/modules/image-carousel/image-carousel";
import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import FadeWrapper from "../fade-wrapper/fade-wrapper";

import styles from "./outro.module.css";

const animationConfig = {};

export default function OutroModule() {
  const { module, getRefCallback } = useModuleContent();
  const xFiresModule = module as StoryXFiresModule;

  return (
    <ScrollModule
      config={animationConfig}
      lengthFactor={xFiresModule.lengthFactor}
      className={styles.outroWrapper}
    >
      <ScrollModule.StickyContainer ref={getRefCallback(0, 0)}>
        <FadeWrapper direction="fadeIn" className={styles.outro}>
          <h2 className={styles.headline}>{xFiresModule.content?.headline}</h2>
          <div className={styles.description}>
            <StoryMarkdown>{xFiresModule.content?.description}</StoryMarkdown>
          </div>
          <ImageCarousel className={styles.imageCarousel} />
        </FadeWrapper>
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
