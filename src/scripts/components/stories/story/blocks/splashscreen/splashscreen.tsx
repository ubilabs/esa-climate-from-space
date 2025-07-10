import { FunctionComponent } from "react";

import { useStory } from "../../../../../providers/story/use-story";

import { StorySectionProps } from "../../../../../types/story";
import { getStoryAssetUrl } from "../../../../../libs/get-story-asset-urls";
import { FormatParallaxLayout } from "../../../layout/block-format-layout/block-format-section";

import styles from "./splashscreen.module.css";

export const SplashScreen: FunctionComponent<StorySectionProps> = ({
  slideIndex,
}) => {
  const { story } = useStory();

  if (!story) {
    return null;
  }

  const { text, image } = story.splashscreen;
  const { id } = story;

  const imageUrl = getStoryAssetUrl(id, image);
  return (
    <FormatParallaxLayout className={styles.splashscreen} index={slideIndex}>
      <img src={imageUrl} />
      <div className={styles.textContainer}>{text}</div>
    </FormatParallaxLayout>
  );
};
