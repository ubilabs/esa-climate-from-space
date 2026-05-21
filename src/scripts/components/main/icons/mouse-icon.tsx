import { FunctionComponent } from "react";

interface Props {
  rounded?: boolean;
}

export const MouseIcon: FunctionComponent<Props> = ({ rounded }) => {
  if (rounded) {
    return (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23 12C24.1046 12 25 12.8954 25 14V18C25 19.1046 24.1046 20 23 20C21.8954 20 21 19.1046 21 18V14C21 12.8954 21.8954 12 23 12Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 4C30.6274 4 36 9.37258 36 16V32L35.9961 32.3096C35.8345 38.691 30.691 43.8345 24.3096 43.9961L24 44H22L21.6904 43.9961C15.309 43.8345 10.1655 38.691 10.0039 32.3096L10 32V16C10 9.37258 15.3726 4 22 4H24ZM22 6C16.4772 6 12 10.4772 12 16V32C12 37.5228 16.4772 42 22 42H24C29.5228 42 34 37.5228 34 32V16C34 10.4772 29.5228 6 24 6H22Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      rotate="-90deg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 5.48276C6 3.55277 7.57354 2 9.5 2L14.5 2C16.4265 2 18 3.55277 18 5.48276L18 18.5172C18 20.4472 16.4265 22 14.5 22L9.5 22C7.57354 22 6 20.4472 6 18.5172L6 5.48276ZM9.5 4C8.66504 4 8 4.67037 8 5.48276L8 18.5172C8 19.3296 8.66504 20 9.5 20L14.5 20C15.335 20 16 19.3296 16 18.5172L16 5.48276C16 4.67037 15.335 4 14.5 4L9.5 4Z"
        fill="currentColor"
      />
      <path
        d="M11 7C11 6.44772 11.4477 6 12 6C12.5523 6 13 6.44772 13 7V9C13 9.55228 12.5523 10 12 10C11.4477 10 11 9.55228 11 9V7Z"
        fill="currentColor"
      />
    </svg>
  );
};
