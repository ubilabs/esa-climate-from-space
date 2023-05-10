import styles from './globe.module.styl';

// fixme: this was copied and modified from ../../libs/create-marker.ts, need to find a good place for this.

export function getMarkerHtml(title: string): string {
  return `
    <div class="${styles.marker}" style="width: 100%">
      <div style="position: relative; display: grid; grid-template-columns: auto 1fr">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_ddd)">
            <circle cx="12" cy="11" r="9" fill="#00AE9D" />
          </g>
          <circle cx="12" cy="11" r="3.75" fill="white" />
          <defs>
            <filter id="filter0_ddd" x="0" y="0" width="24" height="24" filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="1.5" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
              <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.14 0" />
              <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow" result="shape" />
            </filter>
          </defs>
        </svg>


        <div style="display: flex; margin-top: 3px">
          <svg
            style="z-index: 1"
            height="24"
            viewBox="0 0 8 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="matrix(1,0,0,1,-5.58325,-4)">
              <path
                d="M14,4L14,28L5.583,28C8.905,25.068 11,20.779 11,16C11,11.221 8.905,6.932 5.583,4L14,4Z"
                style="fill: rgb(48, 64, 77);"
              />
            </g>
          </svg>
          <div class="${styles.markerTitle}">
            ${title}
          </div>
        </div>
      </div>
    </div>
  `;
}
