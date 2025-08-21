import { FunctionComponent } from "react";
import TimeAndWavelengthBlend from "../shared/time-and-wavelength-blend-wrapper/time-and-wavelength-blend";
import { StorySectionProps } from "../../../../../../../types/story";

const ImageWavelength: FunctionComponent<StorySectionProps> = ({
  ref,
  ...props
}) => {
  return <TimeAndWavelengthBlend {...props} ref={ref} animationDirection="vertical" />;
};

export default ImageWavelength;
