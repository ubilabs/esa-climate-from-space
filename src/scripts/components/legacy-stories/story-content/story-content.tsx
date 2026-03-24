import { FunctionComponent } from "react";
import rehypeRaw from "rehype-raw";
import cx from "classnames";

import { StoryMarkdown } from "../../shared/story-markdown/story-markdown";
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

  return (
    <div className={contentClasses}>
      <StoryMarkdown
        storyId={storyId}
        rehypePlugins={[rehypeRaw]}
        allowedElements={config.markdownAllowedElements}
      >
        {storyText || ""}
      </StoryMarkdown>
    </div>
  );
};

export default StoryContent;
