import { FunctionComponent } from "react";
import BlendWrapper from "../shared/blend-wrapper/blend-wrapper";
import { StorySectionProps } from "../../../../../../../types/story";

const FrequencyBlend: FunctionComponent<StorySectionProps> = ({
  ref,
  ...props
}) => {
  return <BlendWrapper {...props} ref={ref} animationDirection="vertical" />;
};

export default FrequencyBlend;
