import { FunctionComponent } from "react";
import { GetDataWidget } from "../data-widget/data-widget";

interface Props {
  className?: string;
  autoplay?: boolean;
  touchable?: boolean;
}

export const GlobeCompareLayer: FunctionComponent<Props> = ({
  className,
  autoplay = false,
  touchable = true,
}) => {
  return (
    <GetDataWidget
      className={className}
      showMarkers={false}
      autoplay={autoplay}
      touchable={touchable}
    />
  );
};
