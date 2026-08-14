import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import { StoryMarkdown } from "../../../../../../shared/story-markdown/story-markdown";
import ImageCarousel from "../../../../blocks/image-gallery/modules/image-carousel/image-carousel";

import styles from "./outro.module.css";

export default function OutroModule() {
  const { module } = useModuleContent();
  const xFiresModule = module as StoryXFiresModule;

  return (
    <div className={styles.outro}>
      <h2 className={styles.headline}>{xFiresModule.content?.headline}</h2>
      <div className={styles.description}>
        <StoryMarkdown>{xFiresModule.content?.description}</StoryMarkdown>
      </div>
      <ImageCarousel className={styles.imageCarousel} />
    </div>
  );
}
