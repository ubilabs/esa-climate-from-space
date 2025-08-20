import { FunctionComponent } from "react";
import cx from "classnames";

import { getStoryAssetUrl } from "../../../libs/get-story-asset-urls";

import Caption from "../caption/caption";

import { ImageItem } from "../../../types/gallery-item";
import { ImageFit } from "../../../types/image-fit";

import styles from "./story-image.module.css";

interface Props {
  storyId: string;
  imageItem: ImageItem;
  showLightbox: boolean;
}

const StoryImage: FunctionComponent<Props> = ({
  storyId,
  imageItem,
  showLightbox,
}) => {
  const imageUrl = getStoryAssetUrl(storyId, imageItem.image);
  const { imageCaption, imageFit } = imageItem;
  return (
    <>
      <img
        className={cx(styles.photo, showLightbox && styles.lightboxPhoto)}
        style={{
          objectFit: imageFit === ImageFit.Cover ? "cover" : "contain",
        }}
        src={imageUrl}
        alt={imageItem.imageCaption || ""}
      />
      {imageCaption && (
        <Caption
          showLightbox={showLightbox}
          content={imageCaption}
          imageFit={imageFit}
        />
      )}
    </>
  );
};

export default StoryImage;
