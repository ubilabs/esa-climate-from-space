import { StorySectionProps } from "../../../../../../../types/story";
import TimeAndWavelengthBlend from "../shared/time-and-wavelength-blend-wrapper/time-and-wavelength-blend";
import { FunctionComponent } from "react";

const ImageTime: FunctionComponent<StorySectionProps> = ({
  getRefCallback,
  ...props
}) => {
  return (
    <TimeAndWavelengthBlend
      {...props}
      getRefCallback={getRefCallback}
      animationDirection="horizontal"
    />
  );
};

export default ImageTime;
