import { FunctionComponent } from "react";
import { GlobeItem } from "../../../types/gallery-item";
import { GetLocalDataWidget } from "../data-widget/local-data-widget";

interface Props {
  className?: string;
  globeItem?: GlobeItem;
  autoplay?: boolean;
  touchable?: boolean;
}

export const GlobeCompareLayer: FunctionComponent<Props> = ({
  className,
  autoplay = false,
  touchable = true,
  globeItem,
}) => {
  if (!globeItem) {
    return null;
  }

  return (
    <GetLocalDataWidget
      className={className}
      globeItem={globeItem}
      autoplay={autoplay}
      touchable={touchable}
    />
  );
};
