import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import cx from "classnames";

import { getStoryAssetUrl } from "../../../libs/get-story-asset-urls";
import config from "../../../config/main";

import { AppRoute } from "../../../types/app-routes";
import { Slide } from "../../../types/story";

import styles from "./story-content.module.css";

interface Props {
  storyId: string;
  route: AppRoute;
  slide: Slide;
}

const StoryContent: FunctionComponent<Props> = ({ route, slide, storyId }) => {
  const storyText = route === AppRoute.Stories ? slide.text : slide.shortText;

  const contentClasses = cx(
    styles.content,
    route === (AppRoute.LegacyStory || AppRoute.LegacyStories) &&
      styles.shortTextContent,
  );

  const transformImageUri = (originalSrc: string) =>
    getStoryAssetUrl(storyId, originalSrc);

  const transformLinkUri = (originalSrc: string) =>
    getStoryAssetUrl(storyId, originalSrc);

  const getLinkTarget = (originalSrc: string) => {
    if (originalSrc.startsWith("stories")) {
      return "_self";
    }

    return "_blank";
  };

  return (
    <div className={contentClasses}>
      <ReactMarkdown
        children={storyText || ""}
        transformImageUri={transformImageUri}
        transformLinkUri={transformLinkUri}
        linkTarget={getLinkTarget}
        allowedElements={config.markdownAllowedElements}
      />
    </div>
  );
};

export default StoryContent;
