import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {
  Viewer,
  Cartesian3,
  BillboardGraphics,
  Entity,
  ScreenSpaceEventHandler,
  defined,
  ScreenSpaceEventType,
  ConstantProperty,
  VerticalOrigin,
  HorizontalOrigin,
  Cartesian2
} from 'cesium';

import {showMarkersSelector} from '../selectors/show-markers';
import showMarkersAction from '../actions/show-markers';

import {StoryList, StoryListItem} from '../types/story-list';

export const useMarkers = (viewer: Viewer | null, stories: StoryList) => {
  const showMarkers = useSelector(showMarkersSelector);
  const history = useHistory();
  const dispatch = useDispatch();

  // create marker for every story
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

function createMarker(story: StoryListItem) {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 300;

    const image = new Image();
    image.src = `data:image/svg+xml;base64,${window.btoa(
      getSvgString(unescape(encodeURIComponent(story.title)))
    )}`;

    image.onload = function() {
      // @ts-ignore
      canvas.getContext('2d').drawImage(image, 0, 0);

      resolve(
        new Entity({
          id: `${story.id}`,
          position: Cartesian3.fromDegrees(
            story.position[0],
            story.position[1]
          ),
          billboard: new BillboardGraphics({
            image: new ConstantProperty(canvas),
            verticalOrigin: new ConstantProperty(VerticalOrigin.TOP),
            horizontalOrigin: new ConstantProperty(HorizontalOrigin.LEFT),
            pixelOffset: new ConstantProperty(new Cartesian2(0, 0))
          })
        })
      );
    };
  });
}

function getSvgString(storyTitle: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" height="200" width="700">
  <foreignObject width="100%" height="100%">
    <div
      xmlns="http://www.w3.org/1999/xhtml"
      style="width: 100%">
      <div style="position: relative; display: flex; flex-direction: row;">
        <svg
          width="38"
          height="49"
          viewBox="0 0 38 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_ddd)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.19895 25.8993C3.80148 23.5432 3 20.7977 3 17.8666C3 9.10372 10.1634 2 19 2C27.8366 2 35 9.10372 35 17.8666C35 20.7977 34.1985 23.5432 32.801 25.8993H32.8096C32.0437 27.0863 31.0706 29.0672 25.3139 33.7809C19.5571 38.4946 21.1684 45 18.9943 45H19.0057C16.8316 45 18.4429 38.4946 12.6861 33.7809C6.92938 29.0672 5.95634 27.0863 5.19041 25.8993H5.19895Z"
              fill="#00AE9D"
            />
          </g>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M19 24C22.3137 24 25 21.3137 25 18C25 14.6863 22.3137 12 19 12C15.6863 12 13 14.6863 13 18C13 21.3137 15.6863 24 19 24Z"
            fill="white"
          />
          <defs>
            <filter
              id="filter0_ddd"
              x="0"
              y="0"
              width="38"
              height="49"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="1.5" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="1" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow"
                result="effect2_dropShadow"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="1" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.14 0"
              />
              <feBlend
                mode="normal"
                in2="effect2_dropShadow"
                result="effect3_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect3_dropShadow"
                result="shape"
              />
            </filter>
          </defs>
        </svg>

        <div style="display: flex; margin-top: 7px;">
            <svg
            style="z-index: 1"
            height="49"
            viewBox="0 0 8 49"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            >
            <g transform="matrix(1,0,0,1,-5.58325,-4)">
              <path
                d="M14,4L14,28L5.583,28C8.905,25.068 11,20.779 11,16C11,11.221 8.905,6.932 5.583,4L14,4Z"
                style="fill: rgb(48, 64, 77);"
              />
            </g>
            </svg>
          <div
            style="
              box-sizing: border-box;
              width: fit-content;
              max-width: 500px;
              height: 24px;
              color: white;
              padding: 6px 16px;
              font-family: NotesEsa, Arial;
              font-size: 11px;
              text-transform: uppercase;
              background-color: #30404d;
              border-bottom-right-radius: 25px;
              border-top-right-radius: 25px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.14), 0px 3px 4px rgba(0, 0, 0, 0.12), 0px 1px 5px rgba(0, 0, 0, 0.2);"
          >
            ${storyTitle}
          </div>
        </div>
      </div>
    </div>
  </foreignObject>
</svg>`;
}
