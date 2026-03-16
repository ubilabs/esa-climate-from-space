import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CameraView } from "@ubilabs/esa-webgl-globe";
import { useAppRouteFlags } from "../../../hooks/use-app-route-flags";

import { setGlobeSpinning } from "../../../reducers/globe/spinning";
import { setGlobeTime } from "../../../reducers/globe/time";
import { setGlobeView } from "../../../reducers/globe/view";
import { updateLayerLoadingState } from "../../../reducers/globe/layer-loading-state";
import { flyToSelector } from "../../../selectors/fly-to";
import { globeSpinningSelector } from "../../../selectors/globe/spinning";
import { timeSelector } from "../../../selectors/globe/time";
import { globeViewSelector } from "../../../selectors/globe/view";
import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";

import { LayerLoadingStateChangeHandle } from "../data-viewer/data-viewer";

import { GetDataWidget } from "./data-widget";

interface Props {
  className?: string;
}

export const GetGlobalDataWidget = ({ className }: Props) => {
  const { isStoryEEI } = useAppRouteFlags();
  const globalGlobeView = useSelector(globeViewSelector);
  const globeSpinning = useSelector(globeSpinningSelector);

  const flyTo = useSelector(flyToSelector);

  const dispatch = useDispatch();
  const time = useSelector(timeSelector);

  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const { mainId, compareId } = selectedLayerIds;

  const onMoveStartHandler = useCallback(
    () => globeSpinning && !isStoryEEI && dispatch(setGlobeSpinning(false)),
    [dispatch, globeSpinning, isStoryEEI],
  );

  const onMoveEndHandler = useCallback(
    (view: CameraView) => dispatch(setGlobeView(view)),
    [dispatch],
  );

  const onLayerLoadingStateChangeHandler: LayerLoadingStateChangeHandle =
    useCallback(
      (layerId, loadingState) =>
        dispatch(updateLayerLoadingState({ layerId, loadingState })),
      [dispatch],
    );

  // stop globe spinning when layer is selected
  useEffect(() => {
    if ((mainId || compareId) && globeSpinning && !isStoryEEI) {
      dispatch(setGlobeSpinning(false));
    }
  }, [dispatch, mainId, compareId, globeSpinning, isStoryEEI]);

  const handleSetGlobeTime = useCallback(
    (time: number) => dispatch(setGlobeTime(time)),
    [dispatch],
  );

  return (
    <GetDataWidget 
      className={className}
      globeView={globalGlobeView}
      mainId={mainId}
      compareId={compareId}
      time={time}
      setGlobeTime={handleSetGlobeTime}
      globeSpinning={globeSpinning}
      flyTo={flyTo}
      onMoveStartHandler={onMoveStartHandler}
      onMoveEndHandler={onMoveEndHandler}
      onLayerLoadingStateChangeHandler={onLayerLoadingStateChangeHandler}
    />
  );
};
