import { FunctionComponent } from "react";
import { StorySectionProps } from "../../../../../../types/story";

import { useModuleContent } from "../../../../../../providers/story/module-content/use-module-content";
import { TextBodyLargeSlide } from "./text-body-large-slide/text-body-large-slide";

import { calculateTotalSlides } from "../../../../../../libs/split-text";

import cx from "classnames";

import styles from "./text-body-large.module.css";

/**
 * TextBodyLarge component responsible for rendering text with multiple headlines,
 * sections, links and other markdown elements.
 */

const TextBodyLarge: FunctionComponent<StorySectionProps> = () => {
  const { module, storyId, getRefCallback } = useModuleContent();
  const { slides = [] } = module;

  const totalSlides = calculateTotalSlides(slides);

  return (
    <div className={styles.textBodyLarge}>
      <div
        className={cx(styles.slide)}
        style={{
          height: `calc(${totalSlides} * var(--story-height))`,
        }}
      >
        <div className={styles.slidesContainer}>
          {slides?.map((slide, index) => (
            <TextBodyLargeSlide
              getRefCallback={getRefCallback}
              index={index}
              key={index}
              storyId={storyId}
              slide={slide}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextBodyLarge;
