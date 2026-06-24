import { FunctionComponent } from "react";
import cx from "classnames";
import { EmbeddedItem } from "../../../types/gallery-item";

import styles from "./story-embedded.module.css";
import Caption from "../caption/caption";
import { getStoryAssetUrl } from "../../../libs/get-story-asset-urls";

interface Props {
  storyId: string;
  embeddedItem: EmbeddedItem;
  showLightbox: boolean;
}

const StoryEmbedded: FunctionComponent<Props> = ({
  storyId,
  embeddedItem,
  showLightbox,
}) => {
  const { description } = embeddedItem;
  return (
    <div
      className={cx(
        styles.embeddedContent,
        showLightbox && styles.lightboxEmbeddedContent,
      )}
    >
      {embeddedItem.embeddedSrc && (
        <iframe
          src={getStoryAssetUrl(storyId, embeddedItem.embeddedSrc)}
          title={embeddedItem.description || "Embedded content"}
        />
      )}
      {description && (
        <Caption
          showLightbox={showLightbox}
          content={description}
          position={showLightbox ? "relative" : "static"}
        />
      )}
    </div>
  );
};

export default StoryEmbedded;
