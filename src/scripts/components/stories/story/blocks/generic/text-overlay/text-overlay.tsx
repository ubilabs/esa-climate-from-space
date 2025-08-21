import { FunctionComponent } from "react";
import { StorySectionProps } from "../../../../../../types/story";
import { useFormat } from "../../../../../../providers/story/format/use-format";
import { TextOverlaySlide } from "./text-overlay-slide/text-overlay-slide";

import styles from "./text-overlay.module.css";

/**
 * TextOverlay component responsible for rendering textual content.
 * Suitable for use within any content block (ImageGallery etc.).
 * Capable of generating one or multiple slides with options for no background, image background, or video background.
 *
 */
const TextOverlay: FunctionComponent<StorySectionProps> = ({
  getRefCallback,
}) => {
  const {
    content: { slides },
    storyId,
  } = useFormat();

  return (
    <div className={styles.textOverlay}>
      {slides.map((slide, index) => (
        <TextOverlaySlide
          getRefCallback={getRefCallback}
          key={index}
          storyId={storyId}
          slide={slide}
        />
      ))}
    </div>
  );
};

export default TextOverlay;
