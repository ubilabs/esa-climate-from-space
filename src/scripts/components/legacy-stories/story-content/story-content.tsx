import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import cx from "classnames";

import config from "../../../config/main";

import { AppRoute } from "../../../types/app-routes";
import { Slide } from "../../../types/story";

import styles from "./story-content.module.css";

interface Props {
  storyId: string;
  route: AppRoute;
  slide: Slide;
}

const StoryContent: FunctionComponent<Props> = ({ route, slide }) => {
  const storyText = route === AppRoute.Stories ? slide.text : slide.shortText;

  const contentClasses = cx(
    styles.content,
    route === (AppRoute.LegacyStory || AppRoute.LegacyStories) &&
      styles.shortTextContent,
  );

  return (
    <div className={contentClasses}>
      <ReactMarkdown
        children={storyText || ""}
        rehypePlugins={[rehypeRaw]}
        allowedElements={config.markdownAllowedElements}
      />
    </div>
  );
};

export default StoryContent;
