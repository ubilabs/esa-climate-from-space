import { FunctionComponent, useRef } from "react";

import ReactMarkdown from "react-markdown";
import { ImageModuleSlide } from "../../../../../../../types/story";
import { motion, useTransform } from "motion/react";

import config from "../../../../../../../config/main";

import { useStoryScroll } from "../../../../../../../hooks/use-story-scroll";
import { splitTextIntoChunks } from "../../../../../../../libs/split-text";

import cx from "classnames";

import styles from "./text-overlay-slide.module.css";

interface TextContainerProps {
  text: string;
  className?: string;
  index?: number;
  refProp?: React.Ref<HTMLDivElement>;
}

const TRANSLATE_DISTANCE = 300;

export const TextContainer: FunctionComponent<TextContainerProps> = ({
  refProp,
  text,
  index = 0,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useStoryScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  const translateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    // For even indices, move left; for odd indices, move right
    index % 2 === 0
      ? [-TRANSLATE_DISTANCE, 0, TRANSLATE_DISTANCE]
      : [TRANSLATE_DISTANCE, 0, -TRANSLATE_DISTANCE],
  );

  return (
    <motion.section
      ref={ref}
      style={{
        opacity: opacity,
        translateY: translateY,
      }}
      className={cx(styles.textContainer, "story-grid", className)}
    >
      <div className={styles.textBlock} ref={refProp}>
        <ReactMarkdown
          children={text}
          allowedElements={config.markdownAllowedElements}
        />
      </div>
    </motion.section>
  );
};

interface Props {
  slide: ImageModuleSlide;
  storyId: string;
  getRefCallback: (index: number | string) => (element: HTMLDivElement) => void;
  index: number;
}

export const TextOverlaySlide: FunctionComponent<Props> = ({
  index,
  slide,
  storyId,
  getRefCallback,
}) => {
  if (!slide.text) {
    console.warn(
      `TextOverlaySlide: Slide for story ${storyId} has no text, skipping rendering.`,
    );
    return null;
  }

  const textChunks = splitTextIntoChunks(slide.text);

  return (
    <>
      {textChunks.map((text, chunkIndex) => (
        <div key={chunkIndex}>
          <TextContainer
            text={text}
            index={chunkIndex}
            refProp={getRefCallback(`${index}-${chunkIndex}`)}
          />
        </div>
      ))}
    </>
  );
};
