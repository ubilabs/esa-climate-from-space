import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {
  Viewer,
  ScreenSpaceEventHandler,
  defined,
  ScreenSpaceEventType
} from 'cesium';

import {createMarker} from '../libs/create-marker';

import {Marker} from '../types/marker-type';

export const useMarkers = (
  viewer: Viewer | null,
  markers: Marker[],
  markerLink?: boolean
) => {
  const history = useHistory();
  const dispatch = useDispatch();

  // create marker for each story
  useEffect(() => {
    if (!viewer) {
      return;
    }

    const scene = viewer.scene;
    const handler = new ScreenSpaceEventHandler(
      scene.canvas as HTMLCanvasElement
    );

    markerLink &&
      handler.setInputAction(movement => {
        const pickedObject = scene.pick(movement.position);
        if (defined(pickedObject)) {
          history.push(`/stories/${pickedObject.id._id}/0`);
        }
      }, ScreenSpaceEventType.LEFT_CLICK);

    Promise.all(markers.map(marker => createMarker(marker))).then(entities => {
      viewer.entities.removeAll();
      entities.forEach(entity => viewer.entities.add(entity));
    });

    // eslint-disable-next-line consistent-return
    return () => handler.destroy();
  }, [dispatch, history, markers, markerLink, viewer]);

  return;
};
