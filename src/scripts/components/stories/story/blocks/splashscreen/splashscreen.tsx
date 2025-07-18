import { FunctionComponent, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { motion, useTransform } from "motion/react";

import { getStoryAssetUrl } from "../../../../../libs/get-story-asset-urls";

import { useStoryScroll } from "../../../../../hooks/use-story-scroll";
import { useStory } from "../../../../../providers/story/use-story";

import { StorySectionProps } from "../../../../../types/story";
import { FormatContainer } from "../../../layout/format-container/format-container";


import styles from "./splashscreen.module.css";

export const SplashScreen: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const { story } = useStory();
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useStoryScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  if (!story) {
    return null;
  }

  const { text, image } = story.splashscreen;
  const { id } = story;

  return (
    <FormatContainer className={styles.splashscreen} ref={ref}>
      <div ref={targetRef} className={styles.splashBanner}>
        <motion.div
          className={styles.parallaxContainer}
          style={{
            y: imageY,
            scale,
            backgroundImage: `url(${getStoryAssetUrl(id, image)})`,
          }}
        />
        <motion.div style={{ y: textY }} className={styles.contentContainer}>
          <ReactMarkdown
            className={styles.content}
            children={text}
            allowedElements={["h1", "h2", "h3", "p", "br", "em", "b"]}
          />
        </motion.div>
      </div>
    </FormatContainer>
  );
};

