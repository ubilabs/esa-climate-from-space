import { useState } from "react";

import { flyToToCameraView } from "../../../hooks/use-story-globe";

import { GlobeItem } from "../../../types/gallery-item";

import { GetDataWidget } from "./data-widget";

interface Props {
  className?: string;
  autoplay?: boolean;
  touchable?: boolean;
  globeItem: GlobeItem;
}

export const GetLocalDataWidget = ({
  className,
  globeItem,
  autoplay,
  touchable,
}: Props) => {
  const { layer } = globeItem;

  const [mainLayer, compareLayer] = layer || [];

  const mainId = mainLayer?.id ?? null;
  const compareId = compareLayer?.id ?? null;

  const [globeTime, setGlobeTime] = useState(
    mainLayer?.timestamp ? new Date(mainLayer.timestamp).getTime() : 0,
  );
  const flyTo = globeItem.flyTo;
  const cameraView = flyToToCameraView(flyTo);

  return (
    <GetDataWidget
      className={className}
      mainId={mainId}
      compareId={compareId}
      time={globeTime}
      setGlobeTime={setGlobeTime}
      flyTo={cameraView}
      globeView={cameraView}
      globeSpinning={false}
      showMarkers={false}
      autoplay={autoplay}
      touchable={touchable}
      onMoveStartHandler={() => {}}
      onMoveEndHandler={() => {}}
      onLayerLoadingStateChangeHandler={() => {}}
    />
  );
};
