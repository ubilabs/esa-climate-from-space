import { FunctionComponent } from "react";
import cx from "classnames";

import config from "../../../../../../../config/main";
import { StoryMarkdown } from "../../../../../../shared/story-markdown/story-markdown";

import styles from "./text-block.module.css";

interface Props {
  text: string;
  storyId?: string;
  refProp?: React.Ref<HTMLDivElement>;
  hasRichText?: boolean;
  className?: string;
}

export const TextBlock: FunctionComponent<Props> = ({
  text,
  storyId,
  refProp,
  className,
  hasRichText,
}) => {
  return (
    <div className={cx(styles.textBlock, className)} ref={refProp}>
      <span className={cx(hasRichText ? styles.richText : styles.simpleText)}>
        <StoryMarkdown
          storyId={storyId}
          allowedElements={config.markdownAllowedElements}
        >
          {text}
        </StoryMarkdown>
      </span>
    </div>
  );
};
