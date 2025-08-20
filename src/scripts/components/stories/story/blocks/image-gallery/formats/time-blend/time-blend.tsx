import { StorySectionProps } from "../../../../../../../types/story";
import BlendWrapper from "../shared/blend-wrapper/blend-wrapper";
import { FunctionComponent } from "react";

const TimeBlend: FunctionComponent<StorySectionProps> = ({
  getRefCallback,
  ...props
}) => {
  return (
    <BlendWrapper
      {...props}
      getRefCallback={getRefCallback}
      animationDirection="horizontal"
    />
  );
};

export default TimeBlend;
