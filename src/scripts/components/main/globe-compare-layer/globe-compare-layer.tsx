import { FunctionComponent } from "react";
import { GetDataWidget } from "../data-widget/data-widget";
import { GlobeItem } from "../../../types/gallery-item";

interface Props {
  className?: string;
  globeItem?: GlobeItem
  autoplay?: boolean;
  touchable?: boolean;
}

export const GlobeCompareLayer: FunctionComponent<Props> = ({
  className,
  autoplay = false,
  touchable = true,
  globeItem,
}) => {
  return (
    <GetDataWidget
      className={className}
      globeItem={globeItem}
      showMarkers={false}
      autoplay={autoplay}
      touchable={touchable}
    />
  );
};
