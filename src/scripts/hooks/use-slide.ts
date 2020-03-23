import {useDispatch} from 'react-redux';
import {useEffect} from 'react';

import config from '../config/main';
import setSelectedLayerIdsAction from '../actions/set-selected-layer-id';
import setFlyToAction from '../actions/set-fly-to';
import setGlobeTimeAction from '../actions/set-globe-time';

import {Slide} from '../types/story';

export const useSlide = (slide: Slide) => {
  const dispatch = useDispatch();
  const defaultView = config.globe.view;

  // fly to position given in a slide, if none given set to default
  // set layer given by story slide
  useEffect(() => {
    const [mainLayer, compareLayer] = slide.layer || [];

    dispatch(setFlyToAction(slide.flyTo || defaultView));

    if (mainLayer) {
      dispatch(setSelectedLayerIdsAction(mainLayer.id, true));
      dispatch(setGlobeTimeAction(mainLayer.timestamp || 0));
    }

    if (compareLayer) {
      dispatch(setSelectedLayerIdsAction(compareLayer.id, false));
    }
  }, [dispatch, defaultView, slide]);

  return;
};
