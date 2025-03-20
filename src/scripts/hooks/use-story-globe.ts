import { useDispatch } from "react-redux";
import { useEffect } from "react";

import config from "../config/main";
import { setFlyTo } from "../reducers/fly-to";
import { setGlobeTime } from "../reducers/globe/time";
import { setSelectedLayerIds } from "../reducers/layers";

import { GlobeItem } from "../types/gallery-item";

import { CameraView, RenderMode } from "@ubilabs/esa-webgl-globe";

function flyToToCameraView(flyTo: GlobeItem["flyTo"]): CameraView {
  return {
    isAnimated: false,
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

console.log("cameraView", cameraView);
    dispatch(setFlyTo(cameraView || defaultView));
    dispatch(
      setSelectedLayerIds({
        layerId: mainLayer?.id || null,
        isPrimary: true,
      }),
    );
    dispatch(
      setSelectedLayerIds({
        layerId: compareLayer?.id || null,
        isPrimary: false,
      }),
    );
    dispatch(setGlobeTime(slideTime));
  }, [dispatch, defaultView, globeItem]);

  return;
};
