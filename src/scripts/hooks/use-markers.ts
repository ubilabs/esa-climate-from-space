// import {useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {
  Viewer,
  Color,
  Cartesian2,
  Cartesian3,
  HorizontalOrigin,
  VerticalOrigin,
  LabelStyle,
  ConstantProperty,
  BillboardGraphics,
  LabelGraphics,
  Entity,
  ScreenSpaceEventHandler,
  defined,
  ScreenSpaceEventType
} from 'cesium';

import markerIcon from '../../../assets/images/marker.svg';
import {showMarkersSelector} from '../selectors/show-markers';
import showMarkersAction from '../actions/show-markers';

import {StoryList} from '../types/story-list';

export const useMarkers = (viewer: Viewer | null, stories: StoryList) => {
  const showMarkers = useSelector(showMarkersSelector);
  const history = useHistory();
  const dispatch = useDispatch();
  // create marker for every story

  useEffect(() => {
    if (!viewer) {
      return;
    }

    if (!showMarkers) {
      viewer.entities.removeAll();
      return;
    }

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

    const markers =
      showMarkers &&
      stories.map(
        story =>
          new Entity({
            id: `${story.id}`,
            position: Cartesian3.fromDegrees(
              story.position[0],
              story.position[1]
            ),
            billboard: new BillboardGraphics({
              image: new ConstantProperty(markerIcon),
              width: new ConstantProperty(34),
              height: new ConstantProperty(46)
            }),
            label: new LabelGraphics({
              text: new ConstantProperty(`${story.title}`),
              font: '14pt NotesEsa',
              style: new ConstantProperty(LabelStyle.FILL),
              showBackground: new ConstantProperty(true),
              backgroundColor: new ConstantProperty(Color.DARKSLATEGRAY),
              backgroundPadding: new ConstantProperty(new Cartesian2(10, 10)),
              verticalOrigin: new ConstantProperty(VerticalOrigin.CENTER),
              horizontalOrigin: new ConstantProperty(HorizontalOrigin.LEFT),
              pixelOffset: new ConstantProperty(new Cartesian2(20, 0))
            })
          })
      );

    markers.forEach(marker => {
      viewer.entities.add(marker);
    });

    // eslint-disable-next-line consistent-return
    return () => handler.destroy();
  }, [showMarkers, dispatch, history, stories, viewer]);

  return;
};
