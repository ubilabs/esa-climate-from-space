import { StorySectionProps } from "../../../../../../../types/story";
import BlendWrapper from "../shared/blend-wrapper/blend-wrapper";
import { FunctionComponent } from "react";

const TimeBlend: FunctionComponent<StorySectionProps> = ({ ref, ...props }) => {
  return <BlendWrapper {...props} ref={ref} animationDirection="horizontal" />;
};

export default TimeBlend;
