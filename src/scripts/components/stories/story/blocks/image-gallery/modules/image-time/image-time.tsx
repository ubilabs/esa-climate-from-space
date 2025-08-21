import { StorySectionProps } from "../../../../../../../types/story";
import { FunctionComponent } from "react";
import TimeAndWavelengthBlend from "../shared/time-and-wavelength-blend-wrapper/time-and-wavelength-blend";

const ImageTime: FunctionComponent<StorySectionProps> = ({ ...props }) => {
  return <TimeAndWavelengthBlend {...props} animationDirection="horizontal" />;
};

export default ImageTime;
