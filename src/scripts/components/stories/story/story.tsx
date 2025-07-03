import { FunctionComponent } from "react";

import styles from "./story.module.css";

import { ImageGallery } from "./blocks/image-gallery/image-gallery";
import TextBlock from "./blocks/text-block/text-block";

// type StoryExtraProps = {
//   ImageGallery?: typeof ImageGallery;
//   TextBlock?: typeof TextBlock;
// };

const Story: FunctionComponent = () => {
  return (
    <main className={styles.story}>
      <ImageGallery>
        <ImageGallery.CompareMode />
      </ImageGallery>
    </main>
  );
};

export default Story;
