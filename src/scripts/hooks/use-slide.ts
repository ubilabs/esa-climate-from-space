import {useDispatch} from 'react-redux';
import {useEffect} from 'react';

import config from '../config/main';
import setSelectedLayerIdsAction from '../actions/set-selected-layer-id';
import setFlyToAction from '../actions/set-fly-to';
import setGlobeTimeAction from '../actions/set-globe-time';

import {Slide} from '../types/story';
import {CameraView, RenderMode} from '@ubilabs/esa-webgl-globe';

export const useSlide = (slide: Slide) => {
  const dispatch = useDispatch();
  const defaultView = config.globe.view;

  // fly to position given in a slide, if none given set to default
  // set layer given by story slide
  useEffect(() => {
    const [mainLayer, compareLayer] = slide.layer || [];
    const slideTime = mainLayer?.timestamp
      ? Number(new Date(mainLayer?.timestamp))
      : 0;

    // FIXME: the stories are the last place where the old flyTo syntax is being used.
    const cameraView: CameraView = {
      renderMode: 'globe' as RenderMode,
      lat: slide.flyTo.position.latitude,
      lng: slide.flyTo.position.longitude,
      altitude: slide.flyTo.position.height,
      zoom: 0
    };
    dispatch(setFlyToAction(cameraView || defaultView));
    dispatch(setSelectedLayerIdsAction(mainLayer?.id || null, true));
    dispatch(setSelectedLayerIdsAction(compareLayer?.id || null, false));
    dispatch(setGlobeTimeAction(slideTime));
  }, [dispatch, defaultView, slide]);

  return;
};
