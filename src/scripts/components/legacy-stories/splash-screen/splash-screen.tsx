import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";

import config from "../../../config/main";

import cx from "classnames";

import { getStoryAssetUrl } from "../../../libs/get-story-asset-urls";

import { useAppRouteFlags } from "../../../hooks/use-app-route-flags";

import { Slide } from "../../../types/story";

import styles from "./splash-screen.module.css";

interface Props {
  storyId: string;
  slide: Slide;
}

const SplashScreen: FunctionComponent<Props> = ({ storyId, slide }) => {
  const { isStoriesRoute } = useAppRouteFlags();
  const imageUrl =
    slide.splashImage && getStoryAssetUrl(storyId, slide.splashImage);
  const contentClasses = cx(
    styles.content,
    isStoriesRoute && styles.presentationContent,
  );

  return (
    <div
      className={styles.splashscreen}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.0)), url(${imageUrl})`,
        width: "100%",
        height: "100%",
      }}
    >
      <div className={contentClasses}>
        <ReactMarkdown
          children={slide.text}
          allowedElements={config.markdownAllowedElements}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
