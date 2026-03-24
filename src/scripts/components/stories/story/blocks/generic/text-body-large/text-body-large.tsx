import { FunctionComponent } from "react";
import { StorySectionProps } from "../../../../../../types/story";

import { useModuleContent } from "../../../../../../providers/story/module-content/use-module-content";
import { TextBodyLargeSlide } from "./text-body-large-slide/text-body-large-slide";

import cx from "classnames";

import styles from "./text-body-large.module.css";

/**
 * TextBodyLarge is a React functional component that renders a large text body section
 * within a story module. It supports multiple slides, each potentially containing headlines,
 * sections, links, and other markdown elements. The component calculates the total number
 * of slides and dynamically sets the container height to accommodate all slides.
 *
 * @component
 * @param {StorySectionProps} props - The properties for the story section, injected via context.
 * @returns {JSX.Element} The rendered text body large component.
 */
const TextBodyLarge: FunctionComponent<StorySectionProps> = () => {
  const { module, storyId, getRefCallback } = useModuleContent();
  const { slides = [] } = module;

  return (
    <div className={styles.textBodyLarge}>
      <div className={cx(styles.slide)}>
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
