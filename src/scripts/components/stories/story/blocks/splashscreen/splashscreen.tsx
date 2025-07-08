import { FunctionComponent } from "react";

import styles from "./splashscreen.module.css";
import { getStoryAssetUrl } from "../../../../../libs/get-story-asset-urls";
import { useStory } from "../../../../../providers/story/use-story";
import { FormatParallexLayout } from "../../../layout/block-format-layout/block-format-section";
import { StorySectionProps } from "../../../../../types/story";

export const SplashScreen: FunctionComponent<StorySectionProps> = ({
  slideIndex,
}) => {
  const { story } = useStory();

  if (!story) {
    return null;
  }

  const { text, image } = story.splashscreen;
  const { id } = story;
  console.log("imageid", id);

  const imageUrl = getStoryAssetUrl(id, image);
  return (
    <FormatParallexLayout
      className={styles.splashscreen}
      index={slideIndex}
    >
      <img src={imageUrl} />
    </FormatParallexLayout>
  );
};
