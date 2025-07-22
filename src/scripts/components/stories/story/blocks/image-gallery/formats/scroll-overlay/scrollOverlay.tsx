import { FunctionComponent } from "react";
import { StorySectionProps } from "../../../../../../../types/story";
import { FormatContainer } from "../../../../../layout/format-container/format-container";
import { useFormat } from "../../../../../../../providers/story/format/use-format";
import styles from "./scroll-overlay.module.css";
import { ScrollOverlaySlide } from "./scroll-overlay-slide/scroll-overlay-slide";

const ScrollOverlay: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const {
    content: { slides },
    storyId,
  } = useFormat();

  return (
    <FormatContainer ref={ref} className={styles.scrollOverlayContainer}>
      {slides.map((slide, index) => (
        <ScrollOverlaySlide
          key={index}
          isFirst={index === 0}
          storyId={storyId}
          slide={slide}
        />
      ))}
    </FormatContainer>
  );
};

export default ScrollOverlay;
