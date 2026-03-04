import { FunctionComponent } from "react";

interface Props {
  isGlowing: boolean;
}

export const StoryEEIBulb: FunctionComponent<Props> = ({ isGlowing }) => {
  switch (isGlowing) {
    case false:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="74"
          height="140"
          viewBox="0 0 74 140"
          fill="none"
        >
          <g filter="url(#filter0_d_3883_14382)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M37 16C46.3888 16 54 23.6112 54 33V54H55C56.6569 54 58 55.3431 58 57V61C58 62.6569 56.6569 64 55 64H50V91C50 92.6569 48.6569 94 47 94C45.3431 94 44 92.6569 44 91V64H30V121L29.9961 121.154C29.9158 122.739 28.6051 124 27 124C25.3431 124 24 122.657 24 121V64H19C17.3431 64 16 62.6569 16 61V57C16 55.3431 17.3431 54 19 54H20V33C20 23.6112 27.6112 16 37 16ZM26 121C26 121.552 26.4477 122 27 122C27.5523 122 28 121.552 28 121V64H26V121ZM46 91C46 91.5523 46.4477 92 47 92C47.5523 92 48 91.5523 48 91V64H46V91ZM19 56C18.4477 56 18 56.4477 18 57V61L18.0049 61.1025C18.0562 61.6067 18.4823 62 19 62H55L55.1025 61.9951C55.573 61.9472 55.9472 61.573 55.9951 61.1025L56 61V57C56 56.4823 55.6067 56.0562 55.1025 56.0049L55 56H19ZM37 18C28.7157 18 22 24.7157 22 33V54H33V33C33 30.7909 34.7909 29 37 29C39.2091 29 41 30.7909 41 33V54H52V33C52 24.7157 45.2843 18 37 18ZM37 31C35.8954 31 35 31.8954 35 33V54H39V33C39 31.8954 38.1046 31 37 31Z"
              fill="white"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_3883_14382"
              x="0"
              y="0"
              width="74"
              height="140"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="8" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.596078 0 0 0 0 0.858824 0 0 0 0 0.807843 0 0 0 0.4 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_3883_14382"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_3883_14382"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      );
    case true:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="110"
          height="162"
          viewBox="0 0 110 162"
          fill="none"
        >
          <g filter="url(#filter0_d_3881_6701)">
            <g filter="url(#filter1_di_3881_6701)">
              <path
                d="M73 78C73.5523 78 74 78.4477 74 79V83C74 83.5523 73.5523 84 73 84H37C36.4477 84 36 83.5523 36 83V79C36 78.4477 36.4477 78 37 78H73Z"
                fill="#00B398"
              />
              <path
                d="M55 40C63.2843 40 70 46.7157 70 55V76H59V55C59 52.7909 57.2091 51 55 51C52.7909 51 51 52.7909 51 55V76H40V55C40 46.7157 46.7157 40 55 40Z"
                fill="#00B398"
              />
            </g>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M55 38C64.3888 38 72 45.6112 72 55V76H73C74.6569 76 76 77.3431 76 79V83C76 84.6569 74.6569 86 73 86H68V113C68 114.657 66.6569 116 65 116C63.3431 116 62 114.657 62 113V86H48V143L47.9961 143.154C47.9158 144.739 46.6051 146 45 146C43.3431 146 42 144.657 42 143V86H37C35.3431 86 34 84.6569 34 83V79C34 77.3431 35.3431 76 37 76H38V55C38 45.6112 45.6112 38 55 38ZM44 143C44 143.552 44.4477 144 45 144C45.5523 144 46 143.552 46 143V86H44V143ZM64 113C64 113.552 64.4477 114 65 114C65.5523 114 66 113.552 66 113V86H64V113ZM37 78C36.4477 78 36 78.4477 36 79V83L36.0049 83.1025C36.0562 83.6067 36.4823 84 37 84H73L73.1025 83.9951C73.573 83.9472 73.9472 83.573 73.9951 83.1025L74 83V79C74 78.4823 73.6067 78.0562 73.1025 78.0049L73 78H37ZM55 40C46.7157 40 40 46.7157 40 55V76H51V55C51 52.7909 52.7909 51 55 51C57.2091 51 59 52.7909 59 55V76H70V55C70 46.7157 63.2843 40 55 40ZM55 53C53.8954 53 53 53.8954 53 55V76H57V55C57 53.8954 56.1046 53 55 53Z"
              fill="white"
            />
            <g filter="url(#filter2_di_3881_6701)">
              <path
                d="M85.005 58.995H93.005"
                stroke="#00B398"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
            <g filter="url(#filter3_di_3881_6701)">
              <path
                d="M83 43.5L89.9282 39.5"
                stroke="#00B398"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
            <g filter="url(#filter4_di_3881_6701)">
              <path
                d="M72.0006 30.4615L76.0006 23.5333"
                stroke="#00B398"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
            <g filter="url(#filter5_di_3881_6701)">
              <path
                d="M55 25L55 17"
                stroke="#00B398"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
            <g filter="url(#filter6_di_3881_6701)">
              <path
                d="M38.0044 30.4615L34.0044 23.5333"
                stroke="#00B398"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
            <g filter="url(#filter7_di_3881_6701)">
              <path
                d="M27.005 43.5L20.0768 39.5"
                stroke="#00B398"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
            <g filter="url(#filter8_di_3881_6701)">
              <path
                d="M25 58.995H17"
                stroke="#00B398"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          </g>

        </svg>
      );
  }
};
