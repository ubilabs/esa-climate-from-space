import { FunctionComponent } from "react";

import styles from "./splashscreen.module.css";
import { FormatParallexSection } from "../block-format-section/block-format-section";
import { useStoryContext } from "../../../stories-parallex-provider/stories-parallex";
import { getStoryAssetUrl } from "../../../../../libs/get-story-asset-urls";

export const SplashScreen: FunctionComponent = () => {
  const { story } = useStoryContext();

  if (!story) {
    return null;
  }

  const { text, image } = story.splashscreen;
  const { id } = story;
  console.log("imageid", id);

  const imageUrl = getStoryAssetUrl(id, image);
  return (
    <FormatParallexSection className={styles.splashscreen}>
      <img src={imageUrl} />
    </FormatParallexSection>
  );
};
