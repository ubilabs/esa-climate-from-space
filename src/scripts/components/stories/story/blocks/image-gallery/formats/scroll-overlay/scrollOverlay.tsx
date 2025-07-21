import { FunctionComponent } from "react";
import { StorySectionProps } from "../../../../../../../types/story";
import { FormatContainer } from "../../../../../layout/format-container/format-container";
import { useFormat } from "../../../../../../../providers/story/format/use-format";

const ScrollOverlay: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const {
    content: { caption , slides},
    storyId,
  } = useFormat();

  console.log("ScrollOverlay content:", slides);
  return (
    <FormatContainer ref={ref}>
      <div>
        <h2>{caption} </h2>
      </div>
    </FormatContainer>
  );
};

export default ScrollOverlay;
