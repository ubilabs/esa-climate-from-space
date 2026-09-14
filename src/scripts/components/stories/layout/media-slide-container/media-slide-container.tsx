import { ReactNode, Ref } from "react";

import { StoryMarkdown } from "../../../shared/story-markdown/story-markdown";
import config from "../../../../config/main";

import { TextBlock } from "../../story/blocks/generic/text-container/text-block/text-block";
import { SlideContainer } from "../slide-container/slide-container";

import cx from "classnames";

import styles from "./media-slide-container.module.css";

type MediaSlideContainerProps = {
  children: ReactNode;
  caption?: string;
  leading?: boolean;
  ref?: Ref<HTMLDivElement>;
  storyId: string;
  text?: string;
};

export const MediaSlideContainer = ({
  children,
  caption,
  leading = true,
  ref,
  storyId,
  text,
}: MediaSlideContainerProps) => (
  <SlideContainer
    ref={ref}
    className={cx(leading && styles.mediaLeading, styles.slide, "story-grid")}
  >
    {text && (
      <TextBlock
        text={text}
        storyId={storyId}
        hasRichText
        className={styles.mediaText}
      />
    )}
    <figure className={styles.mediaContainer}>
      {children}
      <StoryMarkdown
        storyId={storyId}
        allowedElements={config.markdownAllowedElements}
      >
        {caption}
      </StoryMarkdown>
    </figure>
  </SlideContainer>
);
