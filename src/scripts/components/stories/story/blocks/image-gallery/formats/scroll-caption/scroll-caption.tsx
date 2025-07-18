import { FunctionComponent } from "react";
import { useFormat } from "../../../../../../../providers/story/format/use-format";
import { FormatContainer } from "../../../../../layout/format-container/format-container";
import { StorySectionProps } from "../../../../../../../types/story";

import styles from "./scroll-caption.module.css";

const ScrollCaption: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const { content, storyId } = useFormat();
  console.log("ScrollCaption content:", content, "storyId:", storyId);

  return (
    <FormatContainer ref={ref}>
      <div className={styles.scrollCaptionContainer}></div>
    </FormatContainer>
  );
};

export default ScrollCaption;
