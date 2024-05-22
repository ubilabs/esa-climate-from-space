import React, {FunctionComponent} from 'react';

import {ChapterPosition} from '../../../types/globe';

const getIcon = (position: ChapterPosition, isFirst: boolean) => {
  switch (position) {
    case ChapterPosition.CONTENT:
      return (
        <svg
          width="9"
          height="18"
          viewBox="0 0 9 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g id="position-marker-mid">
            <path
              id="Vector 42"
              d="M3.98437 0.5L3.98437 17.5"
              stroke="white"
              strokeLinecap="round"
            />
            <circle
              id="Ellipse 74"
              cx="4.01562"
              cy="9"
              r="4"
              transform="rotate(90 4.01562 9)"
              fill="white"
            />
          </g>
        </svg>
      );
    case ChapterPosition.INTRO:
      if (isFirst) {
        return (
          <svg
            width="12"
            height="17"
            viewBox="0 0 12 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g id="position-marker-story">
              <path
                id="Vector 40"
                d="M5.98437 11.5L5.98437 16"
                stroke="white"
                strokeLinecap="round"
              />
              <circle
                id="Ellipse 77"
                cx="6"
                cy="6"
                r="5.5"
                transform="rotate(90 6 6)"
                stroke="white"
              />
              <circle
                id="Ellipse 74"
                cx="6.01562"
                cy="6"
                r="3"
                transform="rotate(90 6.01562 6)"
                fill="white"
              />
            </g>
          </svg>
        );
      }
      return (
        <svg
          width="12"
          height="22"
          viewBox="0 0 12 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g id="position-marker-chapter">
            <path
              id="Vector 40"
              d="M5.98437 16.5L5.98437 21"
              stroke="white"
              strokeLinecap="round"
            />
            <path
              id="Vector 41"
              d="M5.98438 1L5.98437 5"
              stroke="white"
              strokeLinecap="round"
            />
            <circle
              id="Ellipse 77"
              cx="6"
              cy="11"
              r="5.5"
              transform="rotate(90 6 11)"
              stroke="white"
            />
            <circle
              id="Ellipse 74"
              cx="6.01562"
              cy="11"
              r="3"
              transform="rotate(90 6.01562 11)"
              fill="white"
            />
          </g>
        </svg>
      );
    case ChapterPosition.SUB:
      return (
        <svg
          width="8"
          height="18"
          viewBox="0 0 8 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g id="position-marker-mid">
            <path
              id="Vector 40"
              d="M4 13L4 17.5"
              stroke="white"
              strokeLinecap="round"
            />
            <path
              id="Vector 41"
              d="M4 0.5L4 5.5"
              stroke="white"
              strokeLinecap="round"
            />
            <rect
              id="Rectangle 137"
              x="0.5"
              y="12.5"
              width="7"
              height="7"
              transform="rotate(-90 0.5 12.5)"
              fill="white"
              stroke="white"
            />
            <rect
              id="Rectangle 136"
              x="3"
              y="10"
              width="2"
              height="2"
              transform="rotate(-90 3 10)"
              fill="white"
              stroke="white"
            />
          </g>
        </svg>
      );
    default:
      return null;
  }
};

interface Props {
  position: ChapterPosition;
  isFirst?: boolean;
}

const NavPositionIcon: FunctionComponent<Props> = ({
  position,
  isFirst = false
}) => {
  const icon = getIcon(position, isFirst);

  return icon;
};

export default NavPositionIcon;
