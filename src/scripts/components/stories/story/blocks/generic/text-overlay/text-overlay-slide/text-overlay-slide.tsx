import { FunctionComponent, useRef } from "react";

import ReactMarkdown from "react-markdown";
import { motion, useTransform } from "motion/react";

import config from "../../../../../../../config/main";

import { useStoryScroll } from "../../../../../../../hooks/use-story-scroll";
import { ImageModuleSlide } from "../../../../../../../types/story";

import cx from "classnames";

import styles from "./text-overlay-slide.module.css";
import { splitText } from "../../../../../../../libs/split-text";

interface TextContainerProps {
  text: string;
  className?: string;
  index?: number;
}

const TRANSLATE_DISTANCE = 300;

export const TextContainer: FunctionComponent<TextContainerProps> = ({
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
      tabIndex={-1}
      ref={ref}
      style={{
        opacity: opacity,
        translateY: translateY,
      }}
      className={cx(styles.textContainer, "story-grid", )}
    >
      <div className={styles.textBlock}>
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
  getRefCallback: (index: number) => (element: HTMLDivElement) => void;
}

export const TextOverlaySlide: FunctionComponent<Props> = ({
  slide,
  storyId,
  getRefCallback,
}) => {
  if (!slide.text || slide.text.length === 0) {
    console.warn(
      `TextOverlaySlide: Slide for story ${storyId} has no text, skipping rendering.`,
    );
    return null;
  }
  const textChunks = splitText(slide.text);

  return (
    <>
      {textChunks.map((text, index) => (
        <div ref={getRefCallback(index)} key={index}>
          <TextContainer text={text} index={index} />
        </div>
      ))}
    </>
  );
};
