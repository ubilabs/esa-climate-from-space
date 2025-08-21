import { FunctionComponent } from "react";
import { StorySectionProps } from "../../../../../../../types/story";
import TimeAndWavelengthBlend from "../shared/time-and-wavelength-blend-wrapper/time-and-wavelength-blend";

const ImageWavelength: FunctionComponent<StorySectionProps> = ({
  ref,
  ...props
}) => {
  return <TimeAndWavelengthBlend {...props} ref={ref} animationDirection="vertical" />;
};

export default ImageWavelength;
