import { FunctionComponent } from "react";
import { StoryMarkdown } from "../../shared/story-markdown/story-markdown";
import rehypeRaw from "rehype-raw";

import config from "../../../config/main";

import styles from "./globe-caption.module.css";

interface Props {
  caption: string;
  storyId?: string;
}

const GlobeCaption: FunctionComponent<Props> = ({ caption, storyId }) => {
  return (
    <div className={styles.globeCaption}>
      <StoryMarkdown
        storyId={storyId}
        rehypePlugins={[rehypeRaw]}
        allowedElements={config.markdownAllowedElements}
      >
        {caption}
      </StoryMarkdown>
    </div>
  );
};

export default GlobeCaption;
