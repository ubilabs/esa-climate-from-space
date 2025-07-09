import { FunctionComponent } from "react";

import { getStoryAssetUrl } from "../../../../../libs/get-story-asset-urls";
import { useStory } from "../../../../../providers/story/use-story";
import ReactMarkdown from "react-markdown";
import { FormatParallexLayout } from "../../../layout/block-format-layout/block-format-section";
import { StorySectionProps } from "../../../../../types/story";

import { ParallaxBanner } from "react-scroll-parallax";

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
    <FormatParallexLayout className={styles.splashscreen} index={slideIndex}>
      <ParallaxBanner
        layers={[
          { image: imageUrl, speed: -10, className: styles.parallaxContainer },
          {
            speed: -30,
            style: { display: "grid", placeItems: "center" },
            children: (
              <ReactMarkdown
                className={styles.content}
                children={text}
                allowedElements={["h1", "h2", "h3", "p", "br", "em", "b"]}
              />
            ),
          },
        ]}
        className={styles.splashscreen}
      ></ParallaxBanner>
    </FormatParallexLayout>
  );
};
