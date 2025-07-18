import { FunctionComponent } from "react";
import { useFormat } from "../../../../../../../providers/story/format/use-format";
import { FormatContainer } from "../../../../../layout/format-container/format-container";
import { StorySectionProps } from "../../../../../../../types/story";

const ScrollCaption: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const { content, storyId } = useFormat();
  console.log("ScrollCaption content:", content, "storyId:", storyId);

  return <FormatContainer ref={ref}>Scroll Caption Component</FormatContainer>;
};

export default ScrollCaption;
