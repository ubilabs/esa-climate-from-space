import React, {FunctionComponent} from 'react';

import styles from './satellite-info-icon.module.styl';

interface Props {
  onClick: () => void;
}

const SatelliteInfoIcon: FunctionComponent<Props> = ({onClick}) => (
  <button className={styles.infoIcon} onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none">
      <circle cx="18" cy="18" r="18" fill="#007D8A" />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none">
      <g clipPath="url(#clip0_306_55763)">
        <path
          d="M11 7H13V11H17V13H13V17H11V13H7V11H11V7ZM12 2C17.51 2 22 6.49 22 12C22 17.51 17.51 22 12 22H4C2.9 22 2 21.1 2 20V12C2 6.49 6.49 2 12 2ZM12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4C7.59 4 4 7.59 4 12C4 16.41 7.59 20 12 20Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_306_55763">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </button>
);

export default SatelliteInfoIcon;
