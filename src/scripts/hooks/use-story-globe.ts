import { useDispatch } from "react-redux";
import { useEffect } from "react";

import config from "../config/main";
import setSelectedLayerIdsAction from "../actions/set-selected-layer-id";
import setFlyToAction from "../actions/set-fly-to";
import setGlobeTimeAction from "../actions/set-globe-time";

import { GlobeItem } from "../types/gallery-item";

import { CameraView, RenderMode } from "@ubilabs/esa-webgl-globe";

function flyToToCameraView(flyTo: GlobeItem["flyTo"]): CameraView {
  return {
    renderMode: "globe" as RenderMode.GLOBE,
    lng: flyTo.position.longitude,
    lat: flyTo.position.latitude,
    altitude: flyTo.position.height,
    zoom: 0,
  };
}

export const useStoryGlobe = (globeItem: GlobeItem) => {
  const dispatch = useDispatch();
  const defaultView = config.globe.view;

  // fly to position given in a slide, if none given set to default
  // set layer given by story slide
  useEffect(() => {
    const [mainLayer, compareLayer] = globeItem.layer || [];
    const slideTime = mainLayer?.timestamp
      ? Number(new Date(mainLayer?.timestamp))
      : 0;
    // FIXME: the stories are the last place where the old flyTo syntax is being used.
    const cameraView: CameraView =
      globeItem.flyTo && flyToToCameraView(globeItem.flyTo);

    dispatch(setFlyToAction(cameraView || defaultView));
    dispatch(setSelectedLayerIdsAction(mainLayer?.id || null, true));
    dispatch(setSelectedLayerIdsAction(compareLayer?.id || null, false));
    dispatch(setGlobeTimeAction(slideTime));
  }, [dispatch, defaultView, globeItem]);

  return;
};
