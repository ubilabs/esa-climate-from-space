import { FunctionComponent } from "react";
import { StorySectionProps } from "../../../../../../../types/story";
import { useFormat } from "../../../../../../../providers/story/format/use-format";
import styles from "./scroll-overlay.module.css";
import { ScrollOverlaySlide } from "./scroll-overlay-slide/scroll-overlay-slide";

const ScrollOverlay: FunctionComponent<StorySectionProps> = ({
  getRefCallback,
}) => {
  const {
    content: { slides },
    storyId,
  } = useFormat();

  return (
    <div className={styles.scrollOverlayContainer}>
      {slides.map((slide, index) => (
        <ScrollOverlaySlide
          getRefCallback={getRefCallback}
          key={index}
          storyId={storyId}
          slide={slide}
        />
      ))}
    </div>
  );
};

export default ScrollOverlay;
