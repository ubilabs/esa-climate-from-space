import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {
  Viewer,
  ScreenSpaceEventHandler,
  defined,
  ScreenSpaceEventType
} from 'cesium';

import {createMarker} from '../libs/create-markers';
import {showMarkersSelector} from '../selectors/show-markers';
import showMarkersAction from '../actions/show-markers';

import {StoryList} from '../types/story-list';

export const useMarkers = (viewer: Viewer | null, stories: StoryList) => {
  const showMarkers = useSelector(showMarkersSelector);
  const history = useHistory();
  const dispatch = useDispatch();

  // create marker for each story
  useEffect(() => {
    if (!viewer) {
      return;
    }

    viewer.entities.removeAll();

    const scene = viewer.scene;
    const handler = new ScreenSpaceEventHandler(
      scene.canvas as HTMLCanvasElement
    );

    handler.setInputAction(movement => {
      const pickedObject = scene.pick(movement.position);
      if (defined(pickedObject)) {
        dispatch(showMarkersAction(false));
        history.push(`/stories/${pickedObject.id._id}/0`);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    const markers = showMarkers
      ? stories.map(story => createMarker(story))
      : [];

    Promise.all(markers)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((entities: Array<any>) => {
        entities.forEach(entity => viewer.entities.add(entity));
      })
      .catch(error => console.error(error));

    // eslint-disable-next-line consistent-return
    return () => handler.destroy();
  }, [showMarkers, dispatch, history, stories, viewer]);

  return;
};
