import { FunctionComponent } from "react";

import { getStoryAssetUrl } from "../../../../../libs/get-story-asset-urls";
import { useStory } from "../../../../../providers/story/use-story";
import ReactMarkdown from "react-markdown";
import { FormatParallexLayout } from "../../../layout/block-format-layout/block-format-section";
import { StorySectionProps } from "../../../../../types/story";

import { BannerLayer, ParallaxBanner } from "react-scroll-parallax";

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

  const imageBackgroundLayer: BannerLayer = {
    image: getStoryAssetUrl(id, image),
    className: styles.parallaxContainer,
    translateY: [0, 15],
    scale: [1, 1.1, "easeOutCubic"],
  };

  const textLayer: BannerLayer = {
    translateY: [0, 30],
    scale: [1, 1.05, "easeOutCubic"],
    shouldAlwaysCompleteAnimation: true,
    expanded: false,
    style: { display: "grid", placeItems: "center" },
    children: (
      <ReactMarkdown
        className={styles.content}
        children={text}
        allowedElements={["h1", "h2", "h3", "p", "br", "em", "b"]}
      />
    ),
  };

  return (
    <FormatParallexLayout className={styles.splashscreen} index={slideIndex}>
      <ParallaxBanner
        layers={[imageBackgroundLayer, textLayer]}
        className={styles.splashscreen}
      ></ParallaxBanner>
    </FormatParallexLayout>
  );
};
