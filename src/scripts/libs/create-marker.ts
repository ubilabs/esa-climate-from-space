import {
  Cartesian3,
  BillboardGraphics,
  Entity,
  ConstantProperty,
  VerticalOrigin,
  HorizontalOrigin,
  Cartesian2
} from 'cesium';

import NotesEsaBold from '../../../assets/fonts/NotesEsaBol.otf';

import {Marker} from '../types/marker-type';

const cache: Record<string, Entity> = {};

export async function createMarker(marker: Marker): Promise<Entity> {
  if (cache[marker.title]) {
    return Promise.resolve(cache[marker.title]);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 350;
  canvas.height = 32;

  const svgString = await getSvgString(
    unescape(encodeURIComponent(marker.title))
  );

  const image = new Image();
  image.src = `data:image/svg+xml;base64,${window.btoa(svgString)}`;

  return new Promise(resolve => {
    image.onload = function() {
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      context.drawImage(image, 0, 0);

      const entity = new Entity({
        position: Cartesian3.fromDegrees(
          marker.position[0],
          marker.position[1]
        ),
        billboard: new BillboardGraphics({
          image: new ConstantProperty(canvas),
          verticalOrigin: new ConstantProperty(VerticalOrigin.CENTER),
          horizontalOrigin: new ConstantProperty(HorizontalOrigin.LEFT),
          pixelOffset: new ConstantProperty(new Cartesian2(-16, 0))
        })
      });
      entity.addProperty('markerLink');
      // @ts-ignore
      entity.markerLink = marker.link;

      cache[marker.title] = entity;
      resolve(entity);
    };
  });
}

let fontPromise: Promise<string> | null = null;

async function loadFont() {
  if (fontPromise) {
    return fontPromise;
  }
  const response = await fetch(NotesEsaBold);
  const blob = await response.blob();
  const reader = new FileReader();

  fontPromise = new Promise(resolve => {
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });

  return fontPromise;
}

async function getSvgString(storyTitle: string) {
  const base64font = await loadFont();
  const getFontFamily = () => {
    if (
      navigator.userAgent.indexOf('Safari') !== -1 &&
      navigator.userAgent.indexOf('Chrome') === -1
    ) {
      return 'sans-serif';
    }
    return 'NotesEsa';
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" height="200" width="700">
  <foreignObject width="100%" height="100%">
    <style>

    @font-face {
      font-style: normal;
      font-family: NotesEsa;
      src: url(${base64font});
    }
    </style>

    <div
      xmlns="http://www.w3.org/1999/xhtml">
      <div style="position: relative; display: flex; flex-direction: row;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_ddd)">
            <circle cx="12" cy="11" r="9" fill="#00AE9D"/>
          </g>
          <circle cx="12" cy="11" r="3.75" fill="white"/>
          <defs>
            <filter id="filter0_ddd" x="0" y="0" width="24" height="24" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
              <feOffset dy="1"/>
              <feGaussianBlur stdDeviation="1.5"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
              <feOffset dy="2"/>
              <feGaussianBlur stdDeviation="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
              <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
              <feOffset/>
              <feGaussianBlur stdDeviation="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.14 0"/>
              <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow" result="shape"/>
            </filter>
          </defs>
        </svg>


        <div style="display: flex; margin-top: 3px;">
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
              font-family: ${getFontFamily()};
              font-size: 11px;
              letter-spacing: 0.6px;
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
