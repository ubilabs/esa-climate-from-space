import { FunctionComponent } from "react";
import { EmbeddedItem } from "../../../types/gallery-item";

import styles from "./story-embedded.module.css";
import Caption from "../caption/caption";
import { ImageFit } from "../../../types/image-fit";

interface Props {
  embeddedItem: EmbeddedItem;
  showLightbox: boolean;
}

const StoryEmbedded: FunctionComponent<Props> = ({
  embeddedItem,
  showLightbox,
}) => {
  const { description } = embeddedItem;
  return (
    <div className={styles.embeddedContent}>
      <iframe src={embeddedItem.embeddedSrc} title={embeddedItem.description || "Embedded content"}></iframe>
      {description && (
        <Caption
          showLightbox={showLightbox}
          imageFit={ImageFit.Cover}
          content={description}
        />
      )}
    </div>
  );
};

export default StoryEmbedded;
